import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";

// Sources: supplied Engage/Mad CD Portfolio (completed Q2 and linked One Take
// brief), supplied CV and Marketing Portfolio, and client's 18 Nov clarification
// that she handled all four WorkSpan case studies from start to finish.
// Never copies private budgets, artist schedules or whole source documents.
const paragraphs = (...texts: string[]) => texts.map((text, i) => ({
  _type: "block", _key: `acceptance-${i}`, style: "normal", markDefs: [],
  children: [{ _type: "span", _key: `text-${i}`, text, marks: [] }],
}));
const workspan = [
  ["project-deepwatch-workspan", "Deepwatch", "AWS co-sell operations and cloud-partnership growth"],
  ["project-datastax-workspan", "DataStax", "AWS Marketplace migration and operational efficiency"],
  ["project-qualtrics-workspan", "Qualtrics", "AWS Marketplace growth and a scalable cloud-partnership motion"],
  ["project-boomi-workspan", "Boomi", "AWS partnership strategy and co-sell automation"],
];
const changes = new Map<string, Record<string, unknown>>([
  ["project-one-take-studio-sessions", {
    projectContext: paragraphs("One Take is Engage Studios’ music-first studio performance series, built around artists performing in a single, uninterrupted take. The completed first season brought together 11 artists."),
    role: paragraphs("Ayomi created, designed and produced One Take Studio Sessions, shaping the show format and its studio presentation through production."),
    strategicApproach: paragraphs("The production brief establishes a continuous-take performance format with lighting as the main visual differentiator. Purple or orange light gives each performance its character while maintaining a recognisable studio identity.", "The documented content plan pairs full performances with teasers and supporting clips, connecting the studio production to a continuing release programme. These are the documented creative and rollout approach, rather than a claim that every proposed marketing activity was executed."),
    execution: paragraphs("The completed-project record lists 11 performances and 44 supporting content pieces: 55 pieces in total, featuring 11 artists.", "The approved work samples below show finished-performance imagery from the series, including May D’s Take My Time. They demonstrate the studio staging and lighting; they are still images, rather than a complete playable archive of the season."),
  }],
  ...workspan.map(([id, customer, subject]): [string, Record<string, unknown>] => [id, {
    role: paragraphs(`Ayomi handled the ${customer} / WorkSpan customer case study from start to finish as part of her customer-marketing and advocacy work at WorkSpan.`),
    projectContext: paragraphs(`The published story presents ${customer}’s experience with ${subject}. It is a customer narrative produced for WorkSpan, rather than an account of Ayomi operating ${customer}’s business.`),
    execution: paragraphs(`The finished deliverable is the published ${customer} customer case study linked above and below. Read the original story to inspect its narrative and customer evidence in full.`),
    verifiedResults: paragraphs(`Business performance figures in the linked story describe ${customer}’s reported results. They are not Ayomi’s personal sales, growth or operational results. Her contribution here is the end-to-end customer case study.`),
  }]),
]);
async function main() {
  const client = getCliClient({ apiVersion: "2026-11-18" }).withConfig({ useCdn: false, perspective: "raw" });
  const before = await client.fetch<Array<Record<string, unknown> & { _id: string; _rev: string }>>('*[_type == "project"] | order(_id asc)');
  assert(!before.some((p) => p._id.startsWith("drafts.")), "Resolve drafts first");
  const dir = "../media-review/final-client-acceptance-audit/correction-release/";
  writeFileSync(`${dir}cms-before.json`, JSON.stringify(before, null, 2));
  for (const id of changes.keys()) assert(before.some((p) => p._id === id), `Missing ${id}`);
  writeFileSync(`${dir}proposed-content.json`, JSON.stringify(Object.fromEntries(changes), null, 2));
  if (!process.argv.includes("--commit")) { console.log("Dry run: five content-only patches prepared; no CMS writes."); return; }
  let tx = client.transaction();
  for (const [id, fields] of changes) {
    const original = before.find((p) => p._id === id)!;
    tx = tx.patch(id, (patch) => patch.ifRevisionId(original._rev).set(fields));
  }
  await tx.commit();
  const after = await client.fetch<typeof before>('*[_type == "project"] | order(_id asc)');
  assert.equal(after.length, before.length);
  for (const original of before) {
    const current = after.find((p) => p._id === original._id)!;
    for (const key of new Set([...Object.keys(original), ...Object.keys(current)])) {
      if (["_rev", "_updatedAt", ...Object.keys(changes.get(original._id) ?? {})].includes(key)) continue;
      assert.deepEqual(current[key], original[key], `Unexpected change: ${original._id}.${key}`);
    }
  }
  writeFileSync(`${dir}cms-after.json`, JSON.stringify(after, null, 2));
  console.log("Five patches published; all unrelated fields, projects and media preserved.");
}
void main().catch((error) => { console.error(error); process.exitCode = 1; });
