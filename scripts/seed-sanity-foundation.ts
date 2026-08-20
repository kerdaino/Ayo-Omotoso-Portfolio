import { createReadStream, existsSync } from "node:fs";
import { resolve } from "node:path";

import type { IdentifiedSanityDocumentStub } from "@sanity/client";
import { getCliClient } from "sanity/cli";

const API_VERSION = "2026-08-20";
const PROFILE_ID = "profile";
const LINKEDIN_ID = "social-link-linkedin";
const PORTRAIT_PATH = resolve(
  process.cwd(),
  "../public/images/ayo-portrait.jpeg",
);

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

  const foundationDocuments = [
    profileDocument,
    linkedInDocument,
    ...experienceDocuments,
  ];

  const foundationIds = foundationDocuments.map((document) => document._id);
  const existingDocuments = await client.fetch<
    Array<{ _id: string; _type: string }>
  >(`*[_id in $ids]{_id, _type}`, { ids: foundationIds });
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
        existingFoundationDocuments: existingDocuments,
        plannedDocuments: foundationDocuments.map(({ _id, _type }) => ({
          _id,
          _type,
        })),
        portraitAvailable: existsSync(PORTRAIT_PATH),
        projectsPlanned: 0,
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

  if (existsSync(PORTRAIT_PATH)) {
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
  >(`*[_id in $ids] | order(_id asc){_id, _type}`, { ids: foundationIds });

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
