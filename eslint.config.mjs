import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    ".next/**",
    "out/**",
    "studio/dist/**",
    "node_modules/**",
    "media-inbox/**",
    "media-review/**",
    "next-env.d.ts",
  ]),
]);

