import { defineQuery } from "groq";

import { siteProfile } from "@/lib/site";

import { getSanityClient } from "./client";
import { publicProject } from "./public-project";
import type { AllProjectsQueryResult, FeaturedProjectsQueryResult, ProjectBySlugQueryResult } from "./sanity.types";

const profileProjection = `{
  _id,
  publicName,
  professionalTitle,
  heroStatement,
  supportingLine,
  shortBio,
  fullBio,
  education,
  portrait,
  portraitAlt,
  email,
  resume {
    "fileUrl": file.asset->url,
    externalUrl
  },
  linkedIn->{_id, platform, label, url, enabled},
  location,
  availabilityCta,
  seo
}`;

const projectProjection = `{
  _id,
  title,
  "slug": slug.current,
  client,
  year,
  category,
  skills,
  workType,
  status,
  shortSummary,
  projectContext,
  brief,
  role,
  strategicApproach,
  execution,
  verifiedResults,
  collaborators,
  coverImage,
  coverAlt,
  gallery,
  videoUrl,
  "evidenceSections": evidenceSections[publicApproved == true],
  "videos": videos[publicApproved == true] | order(displayOrder asc),
  externalLinks,
  featured,
  displayOrder
}`;

export const profileQuery = defineQuery(
  `*[_type == "profile" && _id == "profile"][0]${profileProjection}`,
);

export const featuredProjectsQuery = defineQuery(
  `*[_type == "project" && showInPortfolio != false && featured == true] | order(coalesce(displayOrder, 9999) asc, year desc) ${projectProjection}`,
);

export const allProjectsQuery = defineQuery(
  `*[_type == "project" && showInPortfolio != false] | order(coalesce(displayOrder, 9999) asc, year desc) ${projectProjection}`,
);

export const projectBySlugQuery = defineQuery(
  `*[_type == "project" && showInPortfolio != false && slug.current == $slug][0]${projectProjection}`,
);

export const experienceQuery = defineQuery(`
  *[_type == "experience"] | order(coalesce(displayOrder, 9999) asc, startYear desc) {
    _id,
    organisation,
    role,
    startYear,
    endYear,
    current,
    shortDescription,
    location,
    displayOrder
  }
`);

export const socialLinksQuery = defineQuery(`
  *[_type == "socialLink" && enabled == true] | order(coalesce(displayOrder, 9999) asc, label asc) {
    _id,
    platform,
    label,
    url,
    displayOrder
  }
`);

export async function getProfile() {
  const client = getSanityClient();
  const profile = client ? await client.fetch(profileQuery) : null;

  if (!profile) {
    return null;
  }

  return {
    ...profile,
    publicName: siteProfile.publicName,
    shortBio: profile.shortBio
      ? profile.shortBio.replaceAll("Ayo Omotoso", siteProfile.publicName)
      : null,
    portraitAlt: profile.portraitAlt
      ? profile.portraitAlt.replaceAll("Ayo Omotoso", siteProfile.publicName)
      : null,
  };
}

export async function getFeaturedProjects() {
  const client = getSanityClient();
  return client ? (await client.fetch<FeaturedProjectsQueryResult>(featuredProjectsQuery)).map(publicProject) : [];
}

export async function getAllProjects() {
  const client = getSanityClient();
  return client ? (await client.fetch<AllProjectsQueryResult>(allProjectsQuery)).map(publicProject) : [];
}

export async function getProjectBySlug(slug: string) {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return null;
  }

  const client = getSanityClient();
  const project = client
    ? await client.fetch<ProjectBySlugQueryResult>(projectBySlugQuery, { slug: normalizedSlug })
    : null;
  return project ? publicProject(project) : null;
}

export async function getExperience() {
  const client = getSanityClient();
  return client ? client.fetch(experienceQuery) : [];
}

export async function getSocialLinks() {
  const client = getSanityClient();
  return client ? client.fetch(socialLinksQuery) : [];
}
