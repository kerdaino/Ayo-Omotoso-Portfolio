import assert from "node:assert/strict";
import { getCliClient } from "sanity/cli";
import { PROJECT_SKILLS } from "../sanity/constants";

// Content-only correction. Existing route slugs and all media are preserved.
async function main() {
  const client = getCliClient({ apiVersion: "2026-08-20" });
  const commit = process.argv.includes("--commit");
  const projects = await client.fetch<
    Array<
      Record<string, unknown> & {
        _id: string;
        _rev: string;
        skills?: string[];
      }
    >
  >('*[_type == "project"] | order(_id asc)');
  const role = (text: string) => [
    {
      _key: "role",
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [{ _key: "role-text", _type: "span", marks: [], text }],
    },
  ];
  const jo = {
    _id: "project-garvicii-jo",
    _type: "project",
    title: 'Garvicii — "JO" Creative Direction',
    slug: { _type: "slug", current: "garvicii-jo-creative-direction" },
    category: "culture",
    skills: [PROJECT_SKILLS[0], PROJECT_SKILLS[2]],
    status: "completed",
    workType: "Creative Direction / Set Design / Art Direction",
    shortSummary:
      'Creative direction, set design and art direction for Garvicii’s "JO".',
    role: role("Creative direction, set design and art direction"),
    featured: false,
    displayOrder: 15,
  };
  const requiredIds = [
    "project-one-take-studio-sessions",
    "project-one-take-sponsorship-deck",
    "project-garvicii-ep-content-plan",
  ];
  for (const id of requiredIds)
    assert(
      projects.some((p) => p._id === id),
      `Missing ${id}`,
    );
  assert(
    !projects.some((p) => p._id.startsWith("drafts.")),
    "Resolve project drafts before correction",
  );
  let transaction = client.transaction();
  const changes = [];
  for (const project of projects) {
    const fields: Record<string, unknown> = {};
    if (project.skills)
      fields.skills = project.skills
        .filter((skill) => skill !== "Events")
        .map((skill) =>
          skill === "Partnerships & Sponsorships"
            ? "Brand Partnerships"
            : skill,
        );
    if (project._id === requiredIds[0]) {
      fields.skills = [PROJECT_SKILLS[0]];
      fields.role = role("Created, Designed & Produced");
    }
    if (project._id === requiredIds[1]) {
      fields.title = "One Take Season 2 — Brand Partnership Proposal";
      fields.skills = [PROJECT_SKILLS[3]];
      assert.equal(project.status, "concept");
    }
    if (project._id === requiredIds[2]) fields.skills = [PROJECT_SKILLS[0]];
    if (project._id === jo._id) {
      const { _id, _type, slug, ...content } = jo;
      void _id;
      void _type;
      void slug;
      Object.assign(fields, content);
    }
    if (Array.isArray(fields.skills)) {
      assert(fields.skills.every((skill) => PROJECT_SKILLS.includes(skill)));
    }
    if (Object.keys(fields).length) {
      transaction = transaction.patch(project._id, (patch) =>
        patch.ifRevisionId(project._rev).set(fields),
      );
      changes.push({ _id: project._id, fields });
    }
  }
  transaction = transaction.createIfNotExists(jo);
  console.log(JSON.stringify({ commit, changes, newProject: jo }, null, 2));
  if (commit) {
    await transaction.commit();
    const updated = await client.fetch<
      Array<Record<string, unknown> & { _id: string }>
    >('*[_type == "project"]');
    for (const before of projects) {
      const after = updated.find((project) => project._id === before._id);
      assert(after);
      for (const field of [
        "slug",
        "coverImage",
        "coverAlt",
        "gallery",
        "videoUrl",
        "externalLinks",
      ]) {
        assert.deepEqual(
          after[field],
          before[field],
          `Preserve ${before._id}.${field}`,
        );
      }
    }
    const result = await client.fetch(
      '*[_type == "project"] | order(displayOrder asc){_id,title,"slug":slug.current,skills,status,role}',
    );
    console.log(
      JSON.stringify(
        { verifiedProjects: result, count: result.length },
        null,
        2,
      ),
    );
  }
}
void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
