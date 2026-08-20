const DEFAULT_API_VERSION = "2026-08-20";
const DEFAULT_DATASET = "production";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? "";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || DEFAULT_DATASET;
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || DEFAULT_API_VERSION;

const projectIdPattern = /^[a-z0-9]+$/;
const datasetPattern = /^[a-z0-9][a-z0-9_-]*$/;
const apiVersionPattern = /^\d{4}-\d{2}-\d{2}$/;

if (projectId && !projectIdPattern.test(projectId)) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID must contain only lowercase letters and numbers.",
  );
}

if (!datasetPattern.test(dataset)) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_DATASET must start with a lowercase letter or number and contain only lowercase letters, numbers, underscores, or hyphens.",
  );
}

if (!apiVersionPattern.test(apiVersion)) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_API_VERSION must use the YYYY-MM-DD format.",
  );
}

export const sanityEnv = Object.freeze({
  apiVersion,
  dataset,
  isConfigured: projectId.length > 0,
  projectId,
});

