import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { getCliClient } from "sanity/cli";
import { HIDDEN_PROJECT_IDS } from "../sanity/portfolio-policy";

// User authorized all eight existing YouTube embeds on 18 November 2026.
// Provider thumbnails are rendered directly; no original media or artwork upload.
const scenes = [
  ["Skate", "eNOSPlN4S2s"], ["Car", "B0T1LBJzaWI"],
  ["Kitchen", "PTUHTzzpez8"], ["Stairs", "4KLMiYG6f-o"],
  ["Dancing studio", "FDocnGhYUaY"], ["Projector studio", "y7hAEwEEqcw"],
  ["VHS studio", "y3eV9HopZWk"], ["Only One Man", "37QlpyMgmyI"],
];
export const videos = scenes.map(([title, id], displayOrder) => ({
  _type: "projectVideo", _key: `shalewa-scene-${String(displayOrder + 1).padStart(2, "0")}`,
  title, playbackUrl: `https://www.youtube.com/watch?v=${id}`, displayOrder, publicApproved: true,
}));
type Project = Record<string, unknown> & { _id: string; _rev: string };
async function main() {
  const directory = resolve(process.cwd(), "../media-review/video-playback-audit/release");
  mkdirSync(directory, { recursive: true });
  const save = (name: string, value: unknown) => writeFileSync(resolve(directory, name), JSON.stringify(value, null, 2));
  const client = getCliClient({ apiVersion: "2026-11-18" }).withConfig({ useCdn: false, perspective: "raw" });
  assert.equal(client.config().projectId, "exj59h9k");
  assert.equal(client.config().dataset, "production");
  const fetchProjects = () => client.fetch<Project[]>('*[_type == "project"] | order(_id asc)');
  const before = await fetchProjects();
  assert.equal(before.length, 16);
  assert(!before.some(p => p._id.startsWith("drafts.")), "Resolve drafts before release");
  assert.equal(before.filter(p => p.showInPortfolio !== false).length, 10);
  assert.deepEqual(before.filter(p => p.showInPortfolio === false).map(p => p._id).sort(), [...HIDDEN_PROJECT_IDS].sort());
  const current = before.find(p => p._id === "project-garvicii-shalewa");
  assert(current);
  assert.equal(current.videoUrl, undefined, "Avoid duplicating a legacy video");
  assert.equal(new Set(videos.map(v => v.playbackUrl)).size, 8);
  const commit = process.argv.includes("--commit");
  if (!commit) {
    save("cms-before.json", before);
    save("planned-videos.json", videos);
    save("assets-before.json", await client.fetch('*[_type in ["sanity.imageAsset", "sanity.fileAsset"]] | order(_id asc)'));
    console.log(JSON.stringify({ prepared: true, public: 10, hidden: 6, videos: 8, cmsWrites: 0 }));
    return;
  }
  const approvedBefore = JSON.parse(readFileSync(resolve(directory, "cms-before.json"), "utf8"));
  assert.deepEqual(before, approvedBefore, "CMS changed during QA; review before retrying");
  const existing = current.videos;
  assert(existing == null || (Array.isArray(existing) && existing.length === 0) || isDeepStrictEqual(existing, videos), "Unexpected existing videos; do not overwrite");
  if (!isDeepStrictEqual(existing, videos))
    await client.patch(current._id).ifRevisionId(current._rev).set({ videos }).commit({ visibility: "sync" });
  const after = await fetchProjects();
  assert.equal(after.length, before.length);
  for (const previous of before) {
    const next = after.find(p => p._id === previous._id);
    assert(next);
    if (previous._id !== current._id) assert.deepEqual(next, previous);
    else {
      for (const key of new Set([...Object.keys(previous), ...Object.keys(next)]))
        if (!["videos", "_rev", "_updatedAt"].includes(key)) assert.deepEqual(next[key], previous[key], `Preserve ${key}`);
      assert.deepEqual(next.videos, videos);
    }
  }
  assert.deepEqual(await client.fetch('*[_type in ["sanity.imageAsset", "sanity.fileAsset"]] | order(_id asc)'), JSON.parse(readFileSync(resolve(directory, "assets-before.json"), "utf8")));
  save("cms-after.json", after);
  save("cms-write-result.json", { public: 10, hidden: 6, onlyShalewaVideosChanged: true, assetsUnchanged: true, videos: 8 });
  console.log("Verified: only Shalewa videos changed; 10 public / 6 hidden; JO and all assets preserved.");
}
void main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
