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
    publicName: "Ayo Omotoso",
    professionalTitle: "Creative Brand Strategist",
    heroStatement: "One Strategic Mind, Many Worlds.",
    supportingLine:
      "I shape ideas, campaigns and experiences across culture and commerce.",
    shortBio:
      "Ayo Omotoso is a Creative Brand Strategist with 8+ years of experience shaping brands, campaigns, content and cultural experiences across entertainment, fashion, technology and media. Her work moves from positioning and concept development through production, launch and audience engagement, combining creative instinct with commercial thinking to make ideas distinctive, relevant and executable.",
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
      status: "completed",
      workType: "Vlog Series / Creative Content",
      role: [textBlock("role", "Creator / Director of Creative Strategy")],
      shortSummary:
        "A vlog series created to close out Garvicii’s previous project, introduce the next phase of his career and give audiences a stronger view of his journey.",
      verifiedResults: bulletList("result", [
        "2 vlog episodes",
        "2 promotional videos",
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
      status: "completed",
      workType: "Music Video Location Sourcing",
      role: [textBlock("role", "Location Sourcing")],
      shortSummary:
        "A location-sourcing assignment after Def Jam requested assistance securing a location for a music video featuring Masicka, Ruger and Oxlade.",
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
      status: "completed",
      workType: "Single Cover Creative Planning",
      role: [
        textBlock(
          "role",
          "Creative Planning / Director of Creative Strategy",
        ),
      ],
      shortSummary:
        "Creative planning for Guchi’s single-cover direction as part of her release work.",
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

  const unapprovedProjectFields = [
    "client",
    "projectContext",
    "brief",
    "strategicApproach",
    "coverImage",
    "coverAlt",
    "gallery",
    "videoUrl",
    "externalLinks",
  ];

  for (const document of projectDocuments) {
    const { _id, _type: documentType, ...verifiedFields } = document;
    void documentType;
    transaction.createIfNotExists(document as IdentifiedSanityDocumentStub);
    transaction.patch(_id, (patch) =>
      patch.set(verifiedFields).unset([
        ...unapprovedProjectFields,
        ...(document._id === PROJECT_IDS[2] ? [] : ["execution"]),
        ...(document._id === PROJECT_IDS[0] ||
        document._id === PROJECT_IDS[1]
          ? []
          : ["verifiedResults"]),
        ...(document._id === PROJECT_IDS[3] ? [] : ["collaborators"]),
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
        portraitAlt: "Portrait of Ayo Omotoso.",
      }),
    );
  }

  await transaction.commit({ visibility: "sync" });

  const seededDocuments = await client.fetch<
    Array<{ _id: string; _type: string }>
  >(`*[_id in $ids] | order(_id asc){_id, _type}`, { ids: plannedIds });

  console.log(
    JSON.stringify(
      {
        committed: true,
        portraitUploaded: Boolean(portraitAssetReference),
        seededDocuments,
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
