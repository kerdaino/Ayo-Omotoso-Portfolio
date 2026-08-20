import { defineCliConfig } from "sanity/cli";

import { studioEnv } from "./env";

export default defineCliConfig({
  api: {
    projectId: studioEnv.projectId,
    dataset: studioEnv.dataset,
  },
  typegen: {
    path: "../sanity/queries.ts",
    schema: "./schema.json",
    generates: "../sanity/sanity.types.ts",
    overloadClientMethods: true,
  },
});

