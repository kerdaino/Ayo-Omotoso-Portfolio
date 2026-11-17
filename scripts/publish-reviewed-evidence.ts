import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { getCliClient } from "sanity/cli";
import { HIDDEN_PROJECT_IDS } from "../sanity/portfolio-policy";

type Project = Record<string, unknown> & { _id: string; _rev: string };
type Media = {
  key: string;
  path: string;
  sha256: string;
  sha1: string;
  clearanceReview: string;
};
async function main() {
  const directory = resolve(process.cwd(), "../media-review/experience-repair");
  const plan = JSON.parse(
    readFileSync(resolve(directory, "evidence-plan.json"), "utf8"),
  ) as { patches: Record<string, Record<string, unknown>>; media: Media[] };
  const commit = process.argv.includes("--commit");
  const approvedPath = resolve(directory, "publication-approval.json");
  const approved = existsSync(approvedPath)
    ? (JSON.parse(readFileSync(approvedPath, "utf8")) as {
        approvedSha256: string[];
      })
    : { approvedSha256: [] };
  const files = plan.media.map((media) => {
    const bytes = readFileSync(resolve(process.cwd(), "..", media.path));
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      media.sha256,
      media.key,
    );
    assert.equal(
      createHash("sha1").update(bytes).digest("hex"),
      media.sha1,
      media.key,
    );
    return { media, bytes };
  });
  console.log(
    JSON.stringify(
      {
        commit,
        projects: Object.keys(plan.patches),
        images: files.length,
        approvedImages: files.filter(({ media }) =>
          approved.approvedSha256.includes(media.sha256),
        ).length,
        pendingReview: files
          .filter(
            ({ media }) => !approved.approvedSha256.includes(media.sha256),
          )
          .map(({ media }) => ({
            key: media.key,
            concern:
              media.clearanceReview ||
              "New public presentation excerpt awaiting visual review",
          })),
      },
      null,
      2,
    ),
  );
  if (!commit) return;
  assert(
    files.every(({ media }) => approved.approvedSha256.includes(media.sha256)),
    "Review and approve every exact derivative before this complete evidence release",
  );
  const client = getCliClient({ apiVersion: "2026-11-17" }).withConfig({
    useCdn: false,
    perspective: "raw",
  });
  assert.equal(client.config().projectId, "exj59h9k");
  assert.equal(client.config().dataset, "production");
  const fetchProjects = () =>
    client.fetch<Project[]>('*[_type == "project"] | order(_id asc)');
  const before = await fetchProjects();
  assert.equal(before.length, 16);
  assert.deepEqual(
    before
      .filter((p) => p.showInPortfolio === false)
      .map((p) => p._id)
      .sort(),
    [...HIDDEN_PROJECT_IDS].sort(),
  );
  const refs = new Map<string, string>();
  const assets: { key: string; id: string; reused: boolean }[] = [];
  for (const { media, bytes } of files) {
    let asset = await client.fetch<{ _id: string } | null>(
      '*[_type == "sanity.imageAsset" && sha1hash == $hash][0]{_id}',
      { hash: media.sha1 },
    );
    const reused = Boolean(asset);
    if (!asset)
      asset = await client.assets.upload("image", bytes, {
        filename: basename(media.path),
        contentType: "image/webp",
      });
    refs.set(`preview-image-${media.key}`, asset._id);
    assets.push({ key: media.key, id: asset._id, reused });
  }
  function replaceRefs(value: unknown): unknown {
    if (typeof value === "string") return refs.get(value) ?? value;
    if (Array.isArray(value)) return value.map(replaceRefs);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, replaceRefs(item)]),
      );
    return value;
  }
  const patches = replaceRefs(plan.patches) as typeof plan.patches;
  assert(
    !/preview-image-|drive\.google|docs\.google|media-inbox|\.mov\b/i.test(
      JSON.stringify(patches),
    ),
  );
  let transaction = client.transaction();
  let changed = 0;
  for (const [id, fields] of Object.entries(patches)) {
    const current = before.find((p) => p._id === id);
    assert(current);
    if (
      !Object.entries(fields).every(([key, value]) =>
        isDeepStrictEqual(current[key], value),
      )
    ) {
      transaction = transaction.patch(id, (patch) =>
        patch.ifRevisionId(current._rev).set(fields),
      );
      changed++;
    }
  }
  if (changed) {
    writeFileSync(
      resolve(directory, "evidence-before.json"),
      JSON.stringify(before, null, 2),
    );
    await transaction.commit({ visibility: "sync" });
  }
  const after = await fetchProjects();
  assert.equal(after.length, 16);
  assert.equal(after.filter((p) => p.showInPortfolio !== false).length, 10);
  for (const previous of before) {
    const current = after.find((p) => p._id === previous._id);
    assert(current);
    const allowed = [
      "_rev",
      "_updatedAt",
      ...Object.keys(patches[previous._id] ?? {}),
    ];
    for (const key of new Set([
      ...Object.keys(previous),
      ...Object.keys(current),
    ]))
      if (!allowed.includes(key))
        assert.deepEqual(
          current[key],
          previous[key],
          `Preserve ${previous._id}.${key}`,
        );
    for (const [key, value] of Object.entries(patches[previous._id] ?? {}))
      assert.deepEqual(current[key], value);
  }
  writeFileSync(
    resolve(directory, "evidence-write-result.json"),
    JSON.stringify(
      { changed, assets, verified: true, total: 16, public: 10, hidden: 6 },
      null,
      2,
    ),
  );
  writeFileSync(
    resolve(directory, "evidence-after.json"),
    JSON.stringify(after, null, 2),
  );
  console.log(
    `Verified ${changed} updated projects; existing media, roles and unrelated fields preserved.`,
  );
}
void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
