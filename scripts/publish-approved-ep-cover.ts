import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { getCliClient } from "sanity/cli";
import { HIDDEN_PROJECT_IDS } from "../sanity/portfolio-policy";

type Project = Record<string, unknown> & { _id: string; _rev: string };
const projectId = "project-garvicii-ep-content-plan";
const filename = "garvicii-missbehave-ep-content-plan-editorial.webp";
const approvedSha256 = "b1be768864833d33a46522e864b458803aa4f61a1e92bf782dde70000cacd655";
const coverAlt = "Original editorial cover for Garvicii’s 2026 Missbehave EP Content Plan, with dark text on cream, an orange panel and dark circle. The name Ayomi Omotoso appears below.";

async function main() {
  const commit = process.argv.includes("--commit");
  const directory = resolve(process.cwd(), "../media-review/ep-cover-release");
  mkdirSync(directory, { recursive: true });
  const bytes = readFileSync(resolve(directory, filename));
  const hash = (algorithm: string) => createHash(algorithm).update(bytes).digest("hex");
  assert.equal(hash("sha256"), approvedSha256, "Use only the approved cover derivative");
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  const client = getCliClient({ apiVersion: "2026-11-16" }).withConfig({ useCdn: false, perspective: "raw" });
  assert.equal(client.config().projectId, "exj59h9k");
  assert.equal(client.config().dataset, "production");
  const before = await client.fetch<Project[]>('*[_type == "project"] | order(_id asc)');
  assert.equal(before.length, 15);
  assert.deepEqual(before.filter((p) => p.showInPortfolio === false).map((p) => p._id).sort(), [...HIDDEN_PROJECT_IDS].sort());
  const project = before.find((p) => p._id === projectId);
  assert(project);
  assert.equal(project.status, "concept");
  assert.notEqual(project.showInPortfolio, false);
  assert(!before.some((p) => p._id === `drafts.${projectId}`));
  console.log(JSON.stringify({ commit, projectId, revision: project._rev, filename, bytes: bytes.length, sha256: approvedSha256, fields: ["coverImage", "coverAlt"], coverAlt }, null, 2));
  if (!commit) return;
  let asset = await client.fetch<{ _id: string; sha1hash: string; url: string } | null>(
    '*[_type == "sanity.imageAsset" && sha1hash == $hash][0]{_id,sha1hash,url}', { hash: hash("sha1") },
  );
  const reused = Boolean(asset);
  if (!asset) asset = await client.assets.upload("image", bytes, { filename, contentType: "image/webp" });
  assert.equal(asset.sha1hash, hash("sha1"));
  const fields = { coverImage: { _type: "image", asset: { _type: "reference", _ref: asset._id } }, coverAlt };
  const changed = !Object.entries(fields).every(([key, value]) => isDeepStrictEqual(project[key], value));
  if (changed) {
    writeFileSync(resolve(directory, "before.json"), JSON.stringify(before, null, 2));
    await client.patch(projectId).ifRevisionId(project._rev).set(fields).commit({ visibility: "sync" });
  }
  const after = await client.fetch<Project[]>('*[_type == "project"] | order(_id asc)');
  assert.equal(after.length, before.length);
  for (const previous of before) {
    const current = after.find((p) => p._id === previous._id);
    assert(current);
    if (previous._id !== projectId) assert.deepEqual(current, previous, `Preserve ${previous._id}`);
    else {
      for (const key of new Set([...Object.keys(previous), ...Object.keys(current)])) {
        if (!["coverImage", "coverAlt", "_rev", "_updatedAt"].includes(key)) assert.deepEqual(current[key], previous[key], `Preserve ${projectId}.${key}`);
      }
      for (const [key, value] of Object.entries(fields)) assert.deepEqual(current[key], value);
    }
  }
  writeFileSync(resolve(directory, "after.json"), JSON.stringify(after, null, 2));
  const result = { verified: true, changed, reused, asset, projectId, coverAlt, total: 15, public: 10, hidden: 5 };
  writeFileSync(resolve(directory, changed ? "upload-result.json" : "idempotence-result.json"), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}
void main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
