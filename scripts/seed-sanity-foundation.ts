import { createReadStream, existsSync } from "node:fs";
import { resolve } from "node:path";

import type { IdentifiedSanityDocumentStub } from "@sanity/client";
import { getCliClient } from "sanity/cli";

const API_VERSION = "2026-08-20";
const PROFILE_ID = "profile";
const LINKEDIN_ID = "social-link-linkedin";
const PROJECT_IDS = [
  "project-one-take-studio-sessions",
  "project-becoming-garvicii",
  "project-masicka-ruger-oxlade-location",
  "project-guchi-single-covers",
  "project-deepwatch-workspan",
  "project-datastax-workspan",
  "project-qualtrics-workspan",
  "project-boomi-workspan",
  "project-plug-and-play-set-design-options",
  "project-lobby-redesign",
  "project-one-take-sponsorship-deck",
  "project-frankly-speaking-brand-partnership-deck",
  "project-guchi-ganja-single-rollout-plan",
  "project-garvicii-ep-content-plan",
] as const;
const PORTRAIT_PATH = resolve(
  process.cwd(),
  "../public/images/ayo-portrait.jpeg",
);

function textBlock(key: string, text: string) {
  return {
    _key: key,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: `${key}-text`,
        _type: "span",
        marks: [],
        text,
      },
    ],
  } as const;
}

function bulletList(keyPrefix: string, items: readonly string[]) {
  return items.map((item, index) => ({
    ...textBlock(`${keyPrefix}-${index + 1}`, item),
    level: 1,
    listItem: "bullet",
  }));
}

async function main() {
  const shouldCommit = process.argv.includes("--commit");
  const client = getCliClient({ apiVersion: API_VERSION });

  const profileDocument = {
    _id: PROFILE_ID,
    _type: "profile",
    publicName: "Ayomi Omotoso",
    professionalTitle: "Creative Brand Strategist",
    heroStatement: "One Strategic Mind, Many Worlds.",
    supportingLine:
      "I shape ideas, campaigns and experiences across culture and commerce.",
    shortBio:
      "Ayomi Omotoso is a Creative Brand Strategist with 8+ years of experience shaping brands, campaigns, content and cultural experiences across entertainment, fashion, technology and media. Her work moves from positioning and concept development through production, launch and audience engagement, combining creative instinct with commercial thinking to make ideas distinctive, relevant and executable.",
    education: [
      {
        _key: "central-saint-martins-fashion-design",
        _type: "educationEntry",
        institution: "Central Saint Martins, University of the Arts London",
        qualification: "Fashion Design Programme",
        completion: "July 2025",
      },
      {
        _key: "nevada-state-business-administration",
        _type: "educationEntry",
        institution: "Nevada State College",
        qualification: "Bachelor of Arts in Business Administration",
        focus: "Marketing and International Business",
        completion: "December 2021",
      },
    ],
    email: "ayomiiomotoso@gmail.com",
    linkedIn: {
      _type: "reference",
      _ref: LINKEDIN_ID,
    },
  } as const;

  const linkedInDocument = {
    _id: LINKEDIN_ID,
    _type: "socialLink",
    platform: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com/ayomiomotoso",
    displayOrder: 10,
    enabled: true,
  } as const;

  const experienceDocuments = [
    {
      _id: "experience-engage-label-services",
      _type: "experience",
      organisation: "Engage Label Services / MAD Solution Distribution",
      role: "Director of Creative Strategy",
      startYear: 2025,
      current: true,
      displayOrder: 10,
    },
    {
      _id: "experience-strike-force-productions",
      _type: "experience",
      organisation: "Strike Force Productions",
      role: "Producer (Consultant)",
      startYear: 2025,
      current: true,
      displayOrder: 20,
    },
    {
      _id: "experience-workspan",
      _type: "experience",
      organisation: "WorkSpan",
      role: "Event & Customer Marketing Coordinator",
      startYear: 2023,
      endYear: 2025,
      current: false,
      displayOrder: 30,
    },
    {
      _id: "experience-africa-ultratainment-media",
      _type: "experience",
      organisation: "Africa Ultratainment Media",
      role: "Operations & Brand Manager",
      startYear: 2022,
      endYear: 2024,
      current: false,
      displayOrder: 40,
    },
    {
      _id: "experience-what-lagos-wore",
      _type: "experience",
      organisation: "What Lagos Wore",
      role: "Editor in Chief",
      startYear: 2022,
      current: true,
      displayOrder: 50,
    },
    {
      _id: "experience-my-sisters-closet",
      _type: "experience",
      organisation: "My Sister's Closet",
      role: "Founder",
      startYear: 2024,
      current: true,
      displayOrder: 60,
    },
  ] as const;

  const projectDocuments = [
    {
      _id: PROJECT_IDS[0],
      _type: "project",
      title: "One Take Studio Sessions",
      slug: {
        _type: "slug",
        current: "one-take-studio-sessions",
      },
      year: 2026,
      category: "culture",
      skills: [
        "Creative Direction & Brand Strategy",
        "Content Production & Visual Storytelling",
      ],
      status: "completed",
      workType: "Studio Sessions / Content Production",
      role: [
        textBlock(
          "role",
          "Director of Creative Strategy — Engage/MAD",
        ),
      ],
      shortSummary:
        "A completed Engage Studios session project featuring 11 artists and producing 55 pieces of content across performances and supporting material.",
      verifiedResults: bulletList("result", [
        "11 artists",
        "55 total content pieces",
        "11 performances",
        "44 supporting content pieces",
      ]),
      featured: true,
      displayOrder: 1,
    },
    {
      _id: PROJECT_IDS[1],
      _type: "project",
      title: "Becoming Garvicii Vlog",
      slug: {
        _type: "slug",
        current: "becoming-garvicii",
      },
      year: 2026,
      category: "culture",
      skills: [
        "Creative Direction & Brand Strategy",
        "Content Production & Visual Storytelling",
      ],
      status: "completed",
      workType: "Vlog Series / Creative Content",
      role: [textBlock("role", "Creator / Director of Creative Strategy")],
      shortSummary:
        "A self-assigned creative-content project for Garvicii.",
      brief: [
        textBlock(
          "brief",
          "Created to close out the prior project and introduce the next phase of Garvicii’s career.",
        ),
      ],
      projectContext: [textBlock("context", "Self-assigned.")],
      execution: bulletList("execution", [
        "2 vlog episodes",
        "2 promo videos",
        "15 photoshoot images",
      ]),
      featured: true,
      displayOrder: 2,
    },
    {
      _id: PROJECT_IDS[2],
      _type: "project",
      title: "Masicka ft. Ruger & Oxlade — Location Sourcing",
      slug: {
        _type: "slug",
        current: "masicka-ruger-oxlade-location-sourcing",
      },
      year: 2026,
      category: "culture",
      skills: ["Content Production & Visual Storytelling"],
      status: "completed",
      workType: "Music Video Location Sourcing",
      role: [textBlock("role", "Location Sourcing")],
      shortSummary:
        "A completed music-video location-sourcing assignment.",
      projectContext: [textBlock("context", "Assigned by Kamal.")],
      brief: [
        textBlock(
          "brief",
          "Def Jam requested assistance securing a music-video location.",
        ),
      ],
      execution: bulletList("execution", [
        "Location sourcing completed",
        "Finished output: music video",
      ]),
      featured: true,
      displayOrder: 3,
    },
    {
      _id: PROJECT_IDS[3],
      _type: "project",
      title: "Guchi Single Covers",
      slug: {
        _type: "slug",
        current: "guchi-single-covers",
      },
      year: 2026,
      category: "culture",
      skills: [
        "Creative Direction & Brand Strategy",
        "Campaign & Rollout Strategy",
      ],
      status: "completed",
      workType: "Single Cover Creative Planning",
      role: [
        textBlock(
          "role",
          "Creative Planning / Director of Creative Strategy",
        ),
      ],
      shortSummary:
        "Creative planning for Guchi’s single-cover direction.",
      projectContext: [
        textBlock("context", "Submitted April 27, 2026."),
      ],
      brief: [textBlock("brief", "Assigned by JD.")],
      execution: [
        textBlock(
          "execution",
          "Creative planning for Guchi’s single-cover direction.",
        ),
      ],
      collaborators: [
        {
          _key: "jennifer",
          _type: "collaborator",
          name: "Jennifer",
        },
      ],
      featured: true,
      displayOrder: 4,
    },
    {
      _id: PROJECT_IDS[4],
      _type: "project",
      title: "Deepwatch / WorkSpan",
      slug: { _type: "slug", current: "deepwatch-workspan" },
      client: "WorkSpan / Deepwatch",
      category: "b2b",
      skills: [
        "Copywriting & Customer Storytelling",
        "Event & Customer Marketing",
      ],
      status: "completed",
      workType: "Customer Case Study / Advocacy Content",
      role: [
        textBlock(
          "role",
          "Customer Marketing / Case Study & Advocacy Content",
        ),
      ],
      shortSummary:
        "A WorkSpan customer story documenting how Deepwatch used WorkSpan to scale its AWS co-sell operations, reduce manual effort and strengthen its cloud-partnership motion.",
      externalLinks: [
        {
          _key: "workspan-case-study",
          _type: "externalLink",
          label: "Read the WorkSpan case study",
          url: "https://www.workspan.com/customers/deepwatch",
        },
      ],
      featured: true,
      displayOrder: 5,
    },
    {
      _id: PROJECT_IDS[5],
      _type: "project",
      title: "DataStax / WorkSpan",
      slug: { _type: "slug", current: "datastax-workspan" },
      client: "WorkSpan / DataStax",
      category: "b2b",
      skills: [
        "Copywriting & Customer Storytelling",
        "Event & Customer Marketing",
      ],
      status: "completed",
      workType: "Customer Case Study / Advocacy Content",
      role: [
        textBlock(
          "role",
          "Customer Marketing / Case Study & Advocacy Content",
        ),
      ],
      shortSummary:
        "A customer-marketing story covering DataStax's migration to WorkSpan for AWS Marketplace operations, focusing on workflow confidence, unified marketplace visibility and operational efficiency.",
      externalLinks: [
        {
          _key: "workspan-case-study",
          _type: "externalLink",
          label: "Read the WorkSpan case study",
          url: "https://www.workspan.com/customers/datastax",
        },
      ],
      featured: true,
      displayOrder: 6,
    },
    {
      _id: PROJECT_IDS[6],
      _type: "project",
      title: "Qualtrics / WorkSpan",
      slug: { _type: "slug", current: "qualtrics-workspan" },
      client: "WorkSpan / Qualtrics",
      category: "b2b",
      skills: [
        "Copywriting & Customer Storytelling",
        "Event & Customer Marketing",
      ],
      status: "completed",
      workType: "Customer Case Study / Advocacy Content",
      role: [
        textBlock(
          "role",
          "Customer Marketing / Case Study & Advocacy Content",
        ),
      ],
      shortSummary:
        "A WorkSpan customer story documenting Qualtrics' AWS Marketplace growth and the development of a more scalable cloud-partnership motion.",
      externalLinks: [
        {
          _key: "workspan-case-study",
          _type: "externalLink",
          label: "Read the WorkSpan case study",
          url: "https://www.workspan.com/customers/qualtrics",
        },
      ],
      featured: true,
      displayOrder: 7,
    },
    {
      _id: PROJECT_IDS[7],
      _type: "project",
      title: "Boomi / WorkSpan",
      slug: { _type: "slug", current: "boomi-workspan" },
      client: "WorkSpan / Boomi",
      category: "b2b",
      skills: [
        "Copywriting & Customer Storytelling",
        "Event & Customer Marketing",
      ],
      status: "completed",
      workType: "Customer Case Study / Advocacy Content",
      role: [
        textBlock(
          "role",
          "Customer Marketing / Case Study & Advocacy Content",
        ),
      ],
      shortSummary:
        "A WorkSpan customer story covering Boomi's AWS partnership, cloud marketplace strategy and use of WorkSpan automation to support large-scale co-sell activity.",
      externalLinks: [
        {
          _key: "workspan-case-study",
          _type: "externalLink",
          label: "Read the WorkSpan case study",
          url: "https://www.workspan.com/customers/boomi-aws",
        },
      ],
      featured: true,
      displayOrder: 8,
    },
    {
      _id: PROJECT_IDS[8],
      _type: "project",
      title: "Plug & Play Set Design Options",
      slug: { _type: "slug", current: "plug-and-play-set-design-options" },
      year: 2026,
      category: "culture",
      skills: ["Set Design & Experiential"],
      status: "concept",
      workType: "Set Design / Creative Development",
      role: [textBlock("role", "Set Design / Creative Development")],
      shortSummary:
        "Created three different set design options for the Plug & Play hosts to choose from.",
      projectContext: [textBlock("context", "Submitted June 30, 2026.")],
      brief: [textBlock("brief", "Assigned by Kamal.")],
      featured: false,
      displayOrder: 9,
    },
    {
      _id: PROJECT_IDS[9],
      _type: "project",
      title: "Lobby Redesign",
      slug: { _type: "slug", current: "lobby-redesign" },
      year: 2026,
      category: "culture",
      skills: [
        "Set Design & Experiential",
        "Creative Direction & Brand Strategy",
      ],
      status: "concept",
      workType: "Spatial Redesign Direction",
      shortSummary:
        "Developed a redesign direction for the studio lobby so the physical environment better reflected the state-of-the-art positioning of the studio.",
      projectContext: [textBlock("context", "Submitted February 7, 2026.")],
      brief: [textBlock("brief", "Assigned by Kamal and Bugo.")],
      featured: false,
      displayOrder: 10,
    },
    {
      _id: PROJECT_IDS[10],
      _type: "project",
      title: "1Take Sponsorship Deck",
      slug: { _type: "slug", current: "one-take-sponsorship-deck" },
      year: 2026,
      category: "culture",
      skills: ["Partnerships & Sponsorships"],
      status: "concept",
      workType: "Sponsorship / Partnership Strategy",
      shortSummary:
        "Developed a sponsorship deck to attract brand partners for Season 2 of One Take.",
      projectContext: [
        textBlock("context", "Submitted July 2, 2026. Self-initiated."),
      ],
      featured: false,
      displayOrder: 11,
    },
    {
      _id: PROJECT_IDS[11],
      _type: "project",
      title: "Frankly Speaking Brand Partnership Deck",
      slug: {
        _type: "slug",
        current: "frankly-speaking-brand-partnership-deck",
      },
      year: 2026,
      category: "culture",
      skills: ["Partnerships & Sponsorships"],
      status: "concept",
      workType: "Brand Partnership / Sponsorship Direction",
      shortSummary:
        "Developed a brand partnership and sponsorship direction for the Frankly Speaking podcast.",
      projectContext: [
        textBlock("context", "Submitted July 9, 2026. Self-assigned."),
      ],
      featured: false,
      displayOrder: 12,
    },
    {
      _id: PROJECT_IDS[12],
      _type: "project",
      title: "Guchi — GANJA Single Rollout Plan",
      slug: { _type: "slug", current: "guchi-ganja-single-rollout-plan" },
      year: 2026,
      category: "culture",
      skills: [
        "Campaign & Rollout Strategy",
        "Creative Direction & Brand Strategy",
      ],
      status: "concept",
      workType: "Single Rollout Planning / Strategy",
      shortSummary:
        "Developed a rollout strategy designed to strengthen Guchi’s presence with Nigerian audiences around the “GANJA” single.",
      projectContext: [textBlock("context", "Submitted April 27, 2026.")],
      brief: [textBlock("brief", "Assigned by JD.")],
      featured: false,
      displayOrder: 13,
    },
    {
      _id: PROJECT_IDS[13],
      _type: "project",
      title: "Garvicii EP Content Plan",
      slug: { _type: "slug", current: "garvicii-ep-content-plan" },
      year: 2026,
      category: "culture",
      skills: [
        "Campaign & Rollout Strategy",
        "Content Production & Visual Storytelling",
      ],
      status: "concept",
      workType: "EP Content Planning / Strategy",
      shortSummary: "Planned the content direction for Garvicii’s EP release.",
      projectContext: [textBlock("context", "Submitted July 8, 2026.")],
      brief: [textBlock("brief", "Assigned by JD.")],
      featured: false,
      displayOrder: 14,
    },
  ] as const;

  const foundationDocuments = [
    profileDocument,
    linkedInDocument,
    ...experienceDocuments,
  ];
  const plannedDocuments = [...foundationDocuments, ...projectDocuments];

  const plannedIds = plannedDocuments.map((document) => document._id);
  const existingDocuments = await client.fetch<
    Array<{ _id: string; _type: string }>
  >(`*[_id in $ids] | order(_id asc){_id, _type}`, { ids: plannedIds });
  const existingPortraitAssetId = await client.fetch<string | null>(
    `*[_type == "profile" && _id == $profileId][0].portrait.asset._ref`,
    { profileId: PROFILE_ID },
  );
  const unplannedProjectDocuments = await client.fetch<
    Array<{ _id: string; title?: string }>
  >(`*[_type == "project" && !(_id in $ids)] | order(_id asc){_id, title}`, {
    ids: [...PROJECT_IDS],
  });
  const datasetDocuments =
    await client.fetch<Array<{ _type: string }>>(`*[]{_type}`);
  const datasetDocumentTypes = datasetDocuments.reduce<Record<string, number>>(
    (types, document) => {
      types[document._type] = (types[document._type] ?? 0) + 1;
      return types;
    },
    {},
  );
  const clientConfig = client.config();

  console.log(
    JSON.stringify(
      {
        mode: shouldCommit ? "commit" : "dry-run",
        datasetDocumentCount: datasetDocuments.length,
        datasetDocumentTypes,
        configuredProjectMatchesEnvironment:
          clientConfig.projectId === process.env.SANITY_STUDIO_PROJECT_ID,
        configuredDatasetMatchesEnvironment:
          clientConfig.dataset === process.env.SANITY_STUDIO_DATASET,
        existingPlannedDocuments: existingDocuments,
        plannedDocuments: plannedDocuments.map(({ _id, _type }) => ({
          _id,
          _type,
        })),
        plannedProjectPayload: projectDocuments,
        unplannedProjectDocuments,
        portraitAvailable: existsSync(PORTRAIT_PATH),
        existingPortraitAssetId,
        projectsPlanned: projectDocuments.length,
      },
      null,
      2,
    ),
  );

  if (!shouldCommit) {
    console.log(
      "Dry run only. Re-run through `npm run sanity:seed:commit` after reviewing this plan.",
    );
    return;
  }

  let portraitAssetReference: { _type: "reference"; _ref: string } | undefined;

  if (existsSync(PORTRAIT_PATH) && !existingPortraitAssetId) {
    const portraitAsset = await client.assets.upload(
      "image",
      createReadStream(PORTRAIT_PATH),
      {
        filename: "ayo-portrait.jpeg",
      },
    );

    portraitAssetReference = {
      _type: "reference",
      _ref: portraitAsset._id,
    };
  }

  const transaction = client.transaction();

  for (const document of foundationDocuments) {
    const { _id, _type, ...verifiedFields } = document;
    transaction.createIfNotExists(document as IdentifiedSanityDocumentStub);
    transaction.patch(_id, (patch) => {
      let nextPatch = patch.set(verifiedFields);

      if (_type === "experience" && document.current) {
        nextPatch = nextPatch.unset(["endYear"]);
      }

      return nextPatch;
    });
  }

  const optionalProjectFields = [
    "client",
    "year",
    "projectContext",
    "brief",
    "strategicApproach",
    "execution",
    "verifiedResults",
    "collaborators",
    "coverImage",
    "coverAlt",
    "gallery",
    "videoUrl",
    "externalLinks",
  ] as const;

  for (const document of projectDocuments) {
    const { _id, _type: documentType, ...verifiedFields } = document;
    void documentType;
    transaction.createIfNotExists(document as IdentifiedSanityDocumentStub);
    transaction.patch(_id, (patch) =>
      patch.set(verifiedFields).unset([
        ...optionalProjectFields.filter((field) => !(field in document)),
      ]),
    );
  }

  if (portraitAssetReference) {
    transaction.patch(PROFILE_ID, (patch) =>
      patch.set({
        portrait: {
          _type: "image",
          asset: portraitAssetReference,
        },
        portraitAlt: "Portrait of Ayomi Omotoso.",
      }),
    );
  }

  await transaction.commit({ visibility: "sync" });

  const seededDocuments = await client.fetch<
    Array<{ _id: string; _type: string }>
  >(`*[_id in $ids] | order(_id asc){_id, _type}`, { ids: plannedIds });
  const projectVerification = await client.fetch<
    Array<{ _id: string; title: string; skills: string[] | null }>
  >(
    `*[_type == "project"] | order(coalesce(displayOrder, 9999) asc, title asc){_id, title, skills}`,
  );
  const skillCoverage = projectVerification.reduce<Record<string, number>>(
    (coverage, project) => {
      for (const skill of project.skills ?? []) {
        coverage[skill] = (coverage[skill] ?? 0) + 1;
      }
      return coverage;
    },
    {},
  );

  console.log(
    JSON.stringify(
      {
        committed: true,
        portraitUploaded: Boolean(portraitAssetReference),
        seededDocuments,
        projectVerification,
        projectCount: projectVerification.length,
        expectedProjectCount: projectDocuments.length,
        projectCountMatchesExpected:
          projectVerification.length === projectDocuments.length,
        skillCoverage,
      },
      null,
      2,
    ),
  );
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
