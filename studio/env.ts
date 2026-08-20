const frontendProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? "";
const frontendDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ?? "";

const configuredProjectId =
  process.env.SANITY_STUDIO_PROJECT_ID?.trim() || frontendProjectId;
const configuredDataset =
  process.env.SANITY_STUDIO_DATASET?.trim() || frontendDataset;

export const studioEnv = Object.freeze({
  // Syntactically valid local fallbacks let schema extraction run before a
  // real project is authorised. They are never used by the public client.
  dataset: configuredDataset || "production",
  isConfigured: Boolean(configuredProjectId),
  projectId: configuredProjectId || "placeholder",
});

