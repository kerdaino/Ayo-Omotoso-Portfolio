import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";
import { EP_PUBLIC_FIELDS, HIDDEN_PROJECT_IDS } from "../sanity/portfolio-policy";

async function main() {
  const client = getCliClient({ apiVersion: "2026-11-16" });
  const before = await client.fetch<Array<Record<string, unknown> & { _id: string; _rev: string }>>('*[_type == "project"]');
  assert.equal(before.length, 15);
  assert(before.every((p) => !p._id.startsWith("drafts.")));
  for (const id of HIDDEN_PROJECT_IDS) assert(before.some((p) => p._id === id));
  mkdirSync("../media-review/client-corrections", { recursive: true });
  writeFileSync("../media-review/client-corrections/before.json", JSON.stringify(before, null, 2));
  let transaction = client.transaction();
  for (const project of before) {
    const fields: Record<string, unknown> = {};
    if (HIDDEN_PROJECT_IDS.includes(project._id)) fields.showInPortfolio = false;
    if (project._id === "project-garvicii-ep-content-plan") Object.assign(fields, EP_PUBLIC_FIELDS, { showInPortfolio: true });
    if (project._id === "project-garvicii-jo") fields.videoUrl = "https://youtu.be/sCUwXKjGNVQ";
    if (Object.keys(fields).length) transaction = transaction.patch(project._id, (p) => p.ifRevisionId(project._rev).set(fields));
  }
  if (!process.argv.includes("--commit")) return console.log("Dry run: five visibility changes, EP title/summary/visibility, JO video URL only.");
  await transaction.commit({ visibility: "sync" });
  const after = await client.fetch<typeof before>('*[_type == "project"]');
  assert.equal(after.length, before.length);
  assert.deepEqual(after.filter((p) => p.showInPortfolio === false).map((p) => p._id).sort(), [...HIDDEN_PROJECT_IDS].sort());
  for (const original of before) {
    const current = after.find((p) => p._id === original._id)!;
    const permitted = new Set(["_rev", "_updatedAt", "showInPortfolio", ...(original._id === "project-garvicii-ep-content-plan" ? ["title", "shortSummary"] : []), ...(original._id === "project-garvicii-jo" ? ["videoUrl"] : [])]);
    for (const key of new Set([...Object.keys(original), ...Object.keys(current)])) {
      if (!permitted.has(key)) assert.deepEqual(current[key], original[key], `Preserve ${original._id}.${key}`);
    }
  }
  writeFileSync("../media-review/client-corrections/after.json", JSON.stringify(after, null, 2));
  console.log("Verified: 15 retained, exactly five hidden, ten public, all unrelated fields/media unchanged.");
}
void main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
