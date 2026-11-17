import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { getCliClient } from "sanity/cli";
import { HIDDEN_PROJECT_IDS } from "../sanity/portfolio-policy";

type Project = Record<string, unknown> & { _id: string };
type Media = { original: string; asset: string; alt: string; caption: string; sha256: string };
const projectId = "project-garvicii-shalewa";
const slug = "garvicii-shalewa-visual-content";
const approved = [
  ["DSC01360.jpg", "99e99690c1413c0afbc095d519690ea0bb2f135df38358d30ae09ef14ee1b919"],
  ["DSC01162.jpg", "343b951ac47630beb90effd90fad7ef43f40040958d232ee4250fe05746b73c9"],
  ["DSC01313.jpg", "8a0077c32fa740b7ddbce45a90a9427775e3cb1562ae88b669b76a2ba845f9e9"],
  ["DSC00914.jpg", "0e37ea1275ede459c99c0356929e9ed67aba8d518ce13cdf385488760371e768"],
  ["DSC01067.jpg", "7f73c5b4fde42044b9c42e164ad964a342d97b077f3052200bd2a770ff2330d5"],
];
const digest = (bytes: Buffer, algorithm = "sha256") => createHash(algorithm).update(bytes).digest("hex");
const block = (key: string, text: string) => [{ _type: "block", _key: key, style: "normal", markDefs: [], children: [{ _type: "span", _key: `${key}-text`, marks: [], text }] }];

async function main() {
  const commit = process.argv.includes("--commit");
  const directory = resolve(process.cwd(), "../media-review/shalewa-bts-review/final-review");
  const evidence = resolve(directory, "release");
  mkdirSync(evidence, { recursive: true });
  const media = (JSON.parse(readFileSync(resolve(directory, "media-mapping.json"), "utf8")) as { assets: Media[] }).assets;
  assert.equal(media.length, 5);
  const files = media.map((item, index) => {
    assert.equal(item.original, approved[index][0]);
    const bytes = readFileSync(resolve(directory, item.asset));
    assert.equal(digest(bytes), approved[index][1]);
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    return { item, bytes, sha1: digest(bytes, "sha1") };
  });
  const client = getCliClient({ apiVersion: "2026-11-17" }).withConfig({ useCdn: false, perspective: "raw" });
  assert.equal(client.config().projectId, "exj59h9k");
  assert.equal(client.config().dataset, "production");
  const fetchProjects = () => client.fetch<Project[]>('*[_type == "project"] | order(_id asc)');
  const before = await fetchProjects();
  const existing = before.find((p) => p._id === projectId);
  assert.equal(before.length, existing ? 16 : 15);
  assert(!before.some((p) => p._id.startsWith("drafts.")), "Resolve drafts before publishing");
  assert.deepEqual(before.filter((p) => p.showInPortfolio === false).map((p) => p._id).sort(), [...HIDDEN_PROJECT_IDS].sort());
  assert(!before.some((p) => p._id !== projectId && (/shalewa/i.test(String(p.title)) || (p.slug as { current?: string })?.current === slug)), "Possible duplicate Shalewa record");
  console.log(JSON.stringify({ commit, projectId, slug, existing: Boolean(existing), approvedFiles: files.map((f) => f.item.asset) }, null, 2));
  if (!commit) return;
  if (!existing) writeFileSync(resolve(evidence, "before.json"), JSON.stringify(before, null, 2));
  const assets: { _id: string; url: string }[] = [];
  for (const { item, bytes, sha1 } of files) {
    let asset = await client.fetch<{ _id: string; sha1hash: string; url: string } | null>('*[_type == "sanity.imageAsset" && sha1hash == $hash][0]{_id,sha1hash,url}', { hash: sha1 });
    if (!asset) asset = await client.assets.upload("image", bytes, { filename: basename(item.asset), contentType: "image/webp" });
    assert.equal(asset.sha1hash, sha1);
    assets.push({ _id: asset._id, url: asset.url });
  }
  const image = (index: number) => ({ _type: "image", asset: { _type: "reference", _ref: assets[index]._id } });
  const document = {
    _id: projectId, _type: "project", title: "Garvicii — Shalewa Visual Content",
    slug: { _type: "slug", current: slug }, client: "Garvicii", category: "culture",
    skills: ["Creative Direction & Brand Strategy"], workType: "Creative Direction & Production", status: "completed",
    shortSummary: 'Creative direction and production for eight visual interpretations of Garvicii\'s song "Shalewa", exploring different settings, compositions and visual treatments.',
    role: block("shalewa-role", "Creative Direction & Production"),
    coverImage: { ...image(0), hotspot: { _type: "sanity.imageHotspot", x: 0.36, y: 0.53, width: 0.28, height: 0.82 } },
    coverAlt: media[0].alt,
    gallery: media.slice(1).map((item, index) => ({ _type: "galleryImage", _key: `shalewa-${item.original.slice(0, -4).toLowerCase()}`, image: image(index + 1), alt: item.alt, caption: item.caption })),
    featured: false, showInPortfolio: true, displayOrder: 100,
  };
  assert(!/drive\.google|docs\.google|\.mov\b/i.test(JSON.stringify(document)));
  // Creation only: never overwrite an existing record or any other project.
  if (!existing) await client.createIfNotExists(document, { visibility: "sync" });
  const after = await fetchProjects();
  assert.equal(after.length, 16);
  for (const previous of before.filter((p) => p._id !== projectId)) assert.deepEqual(after.find((p) => p._id === previous._id), previous, `Preserve ${previous._id}`);
  const current = after.find((p) => p._id === projectId);
  assert(current);
  for (const [key, value] of Object.entries(document)) assert.deepEqual(current[key], value, `Verify ${key}`);
  assert.equal(current.year, undefined);
  for (const field of ["collaborators", "videoUrl", "externalLinks", "verifiedResults"]) assert.equal(current[field], undefined);
  if (existing) assert.deepEqual(current, existing, "Repeat execution must not mutate the project");
  assert.equal(after.filter((p) => p.showInPortfolio !== false).length, 11);
  assert.deepEqual(after.filter((p) => p.showInPortfolio === false).map((p) => p._id).sort(), [...HIDDEN_PROJECT_IDS].sort());
  writeFileSync(resolve(evidence, "after.json"), JSON.stringify(after, null, 2));
  const result = { verified: true, created: !existing, projectId, slug, assets, total: 16, public: 11, hidden: 5, otherProjectsUnchanged: true };
  writeFileSync(resolve(evidence, existing ? "idempotence-result.json" : "write-result.json"), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}
void main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
