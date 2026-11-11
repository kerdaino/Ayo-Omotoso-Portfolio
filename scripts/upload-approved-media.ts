import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { getCliClient } from "sanity/cli";

type Selection = {
  project: string;
  placement: "cover" | "gallery";
  output: string;
  alt: string;
  caption: string;
  sha256: string;
  width: number;
  height: number;
};
type Document = Record<string, unknown> & {
  _id: string;
  _rev: string;
  title: string;
};
const groups = [
  {
    id: "project-one-take-studio-sessions",
    title: "One Take Studio Sessions",
    files: [
      "one-take-studio-sessions-ewaa-cover.webp",
      "one-take-studio-sessions-mayd-performance.webp",
    ],
  },
  {
    id: "project-plug-and-play-set-design-options",
    title: "Plug & Play Set Design Options",
    files: [
      "plug-and-play-concept-football-set-cover.webp",
      "plug-and-play-concept-net-backdrop.webp",
      "plug-and-play-concept-camping-chairs.webp",
      "plug-and-play-concept-technical-drawing.webp",
    ],
  },
  {
    id: "project-garvicii-jo",
    title: 'Garvicii — "JO" Creative Direction',
    files: [
      "garvicii-jo-official-candlelit-portrait.webp",
      "garvicii-jo-official-seated-portrait.webp",
      "garvicii-jo-executed-red-set-cover.webp",
      "garvicii-jo-red-set-overhead-production.webp",
    ],
  },
  {
    id: "project-one-take-sponsorship-deck",
    title: "One Take Season 2 — Brand Partnership Proposal",
    files: ["one-take-season-2-brand-partnership-proposal-cover.webp"],
  },
];
const writable = ["coverImage", "coverAlt", "gallery"];
const digest = (bytes: Buffer, algorithm: string) =>
  createHash(algorithm).update(bytes).digest("hex");
const galleryKey = (filename: string) =>
  `media-${digest(Buffer.from(filename), "sha256").slice(0, 20)}`;
function protectedContent(document: Document) {
  return Object.fromEntries(
    Object.entries(document).filter(
      ([key]) => ![...writable, "_rev", "_updatedAt"].includes(key),
    ),
  );
}
async function main() {
  const commit = process.argv.includes("--commit");
  assert(
    !commit || process.argv.includes("--permission-confirmed"),
    "Explicit client permission and credits confirmation required before --commit",
  );
  const root = resolve(process.cwd(), ".."); // Run through scripts/run-sanity.mjs (Studio cwd).
  const review = resolve(root, "media-review");
  const selection: Selection[] = JSON.parse(
    readFileSync(resolve(review, "selected-assets.json"), "utf8"),
  );
  assert.equal(selection.length, 11);
  const indexed = new Map(
    selection.map((asset) => [basename(asset.output), asset]),
  );
  assert.equal(indexed.size, 11);
  const client = getCliClient({ apiVersion: "2026-08-20" }).withConfig({
    useCdn: false,
    perspective: "raw",
  });
  const config = client.config();
  assert.equal(config.projectId, "exj59h9k");
  assert.equal(config.dataset, "production");
  const before = await client.fetch<Document[]>(
    '*[_type == "project"] | order(_id asc)',
  );
  assert.equal(
    before.length,
    15,
    "Reconcile changed project count before upload",
  );
  const planned = groups.map((group) => {
    assert(
      !before.some((d) => d._id === `drafts.${group.id}`),
      `Resolve draft for ${group.id}`,
    );
    const document = before.find((d) => d._id === group.id);
    assert(document, `Missing existing project ${group.id}`);
    assert.equal(document.title, group.title);
    return {
      group,
      document,
      assets: group.files.map((filename, index) => {
        const asset = indexed.get(filename);
        assert(asset, `Missing allowlisted ${filename}`);
        assert.equal(asset.project, group.title);
        assert.equal(asset.placement, index === 0 ? "cover" : "gallery");
        assert.equal(asset.output, `media-review/optimised/${filename}`);
        assert(asset.alt.length >= 3 && asset.alt.length <= 220);
        const bytes = readFileSync(resolve(root, asset.output));
        assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
        assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
        assert.equal(digest(bytes, "sha256"), asset.sha256);
        return { ...asset, filename, bytes, sha1: digest(bytes, "sha1") };
      }),
    };
  });
  const plan = planned.map(({ group, document, assets }) => ({
    id: group.id,
    title: group.title,
    revision: document._rev,
    media: assets.map((a) => ({
      filename: a.filename,
      placement: a.placement,
      sha256: a.sha256,
      alt: a.alt,
      caption: a.caption,
      galleryKey: a.placement === "gallery" ? galleryKey(a.filename) : null,
    })),
  }));
  writeFileSync(
    resolve(review, "upload-plan.json"),
    JSON.stringify(
      {
        projectId: config.projectId,
        dataset: config.dataset,
        fields: writable,
        plan,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify(
      { mode: commit ? "commit" : "read-only", projects: plan },
      null,
      2,
    ),
  );
  if (!commit) return;
  writeFileSync(
    resolve(review, "pre-upload-snapshot.json"),
    JSON.stringify(before, null, 2),
  );
  const uploaded = new Map<
    string,
    { _id: string; url: string; sha1hash: string }
  >();
  for (const { assets } of planned)
    for (const asset of assets) {
      // Sanity hashes binary content; lookup also avoids repeat transfer after a partial failure.
      let stored = await client.fetch<{
        _id: string;
        url: string;
        sha1hash: string;
      } | null>(
        '*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]{_id,url,sha1hash}',
        { sha1: asset.sha1 },
      );
      if (!stored)
        stored = await client.assets.upload("image", asset.bytes, {
          filename: asset.filename,
          contentType: "image/webp",
        });
      assert.equal(stored.sha1hash, asset.sha1);
      uploaded.set(asset.filename, stored);
      writeFileSync(
        resolve(review, "uploaded-assets.json"),
        JSON.stringify(Object.fromEntries(uploaded), null, 2),
      );
    }
  assert.equal(uploaded.size, 11);
  assert.equal(
    new Set([...uploaded.values()].map((asset) => asset._id)).size,
    11,
  );
  const assetDocuments = await client.getDocuments(
    [...uploaded.values()].map((asset) => asset._id),
  );
  for (const { assets } of planned)
    for (const asset of assets) {
      const saved = uploaded.get(asset.filename)!;
      const document = assetDocuments.find((item) => item?._id === saved._id);
      assert(document);
      assert.equal(document.sha1hash, asset.sha1);
      const url = new URL(saved.url);
      assert.equal(url.hostname, "cdn.sanity.io");
      assert(url.pathname.startsWith("/images/exj59h9k/production/"));
      const response = await fetch(url);
      assert(response.ok, `Asset CDN verification failed: ${asset.filename}`);
      assert(response.headers.get("content-type")?.startsWith("image/"));
      assert((await response.arrayBuffer()).byteLength > 0);
      // Public delivery is optimised. Verify exact uploaded bytes via Sanity's
      // authenticated original-file endpoint rather than its rendition.
      const rawUrl = new URL(saved.url);
      rawUrl.searchParams.set("dlRaw", asset.filename);
      const original = await fetch(rawUrl, {
        headers: { Authorization: `Bearer ${config.token}` },
      });
      assert(
        original.ok,
        `Original asset verification failed: ${asset.filename}`,
      );
      assert.equal(
        digest(Buffer.from(await original.arrayBuffer()), "sha256"),
        asset.sha256,
      );
    }
  let transaction = client.transaction();
  const expected = new Map<string, Record<string, unknown>>();
  for (const { group, document, assets } of planned) {
    const image = (filename: string) => ({
      _type: "image",
      asset: { _type: "reference", _ref: uploaded.get(filename)!._id },
    });
    const cover = assets[0];
    const fields = {
      coverImage: image(cover.filename),
      coverAlt: cover.alt,
      gallery: assets.slice(1).map((a) => ({
        _key: galleryKey(a.filename),
        _type: "galleryImage",
        image: image(a.filename),
        alt: a.alt,
        ...(a.caption ? { caption: a.caption } : {}),
      })),
    };
    expected.set(group.id, fields);
    if (
      !Object.entries(fields).every(([key, value]) =>
        isDeepStrictEqual(document[key], value),
      )
    ) {
      transaction = transaction.patch(group.id, (patch) =>
        patch.ifRevisionId(document._rev).set(fields),
      );
    }
  }
  if (transaction.serialize().length) await transaction.commit();
  const after = await client.fetch<Document[]>(
    '*[_type == "project"] | order(_id asc)',
  );
  assert.equal(after.length, before.length);
  for (const previous of before) {
    const current = after.find((d) => d._id === previous._id);
    assert(current);
    assert.deepEqual(
      protectedContent(current),
      protectedContent(previous),
      `Protected content changed: ${previous._id}`,
    );
    const media = expected.get(previous._id);
    if (media)
      for (const [key, value] of Object.entries(media))
        assert.deepEqual(
          current[key],
          value,
          `Media/order mismatch: ${previous._id}.${key}`,
        );
    else
      assert.deepEqual(
        current,
        previous,
        `Unselected project changed: ${previous._id}`,
      );
  }
  const report = {
    verified: true,
    projectIds: groups.map((g) => g.id),
    referenceCount: 11,
    galleryOrder: plan.map((p) => ({
      id: p.id,
      files: p.media
        .filter((a) => a.placement === "gallery")
        .map((a) => a.filename),
    })),
    publicAssets: Object.fromEntries(uploaded),
  };
  writeFileSync(
    resolve(review, "verified-upload.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
}
void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
