import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { studioEnv } from "./env";
import { schemaTypes } from "./schemaTypes";
import { portfolioStructure } from "./structure";

const singletonTypes = new Set(["profile"]);
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "default",
  title: studioEnv.isConfigured
    ? "Ayo Omotoso Portfolio"
    : "Ayo Omotoso Portfolio — not connected",
  projectId: studioEnv.projectId,
  dataset: studioEnv.dataset,
  plugins: [structureTool({ structure: portfolioStructure })],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, context) =>
      singletonTypes.has(context.schemaType)
        ? actions.filter(
            ({ action }) => action && singletonActions.has(action),
          )
        : actions,
  },
});

