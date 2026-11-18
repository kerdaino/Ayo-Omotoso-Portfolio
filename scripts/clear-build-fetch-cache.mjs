import { rmSync } from "node:fs";

// Static exports must include the latest published CMS content, even when the
// hosting provider restores a previous Next.js build cache.
rmSync(new URL("../.next/cache/fetch-cache/", import.meta.url), {
  recursive: true,
  force: true,
});
