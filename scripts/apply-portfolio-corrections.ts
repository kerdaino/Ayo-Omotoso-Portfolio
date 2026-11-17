import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { getCliClient } from "sanity/cli";
import {
  EP_PUBLIC_FIELDS,
  HIDDEN_PROJECT_IDS,
} from "../sanity/portfolio-policy";

type Project = Record<string, unknown> & { _id: string; _rev: string };
async function main() {
  const client = getCliClient({ apiVersion: "2026-11-17" }).withConfig({
    useCdn: false,
    perspective: "raw",
  });
  assert.equal(client.config().projectId, "exj59h9k");
  assert.equal(client.config().dataset, "production");
  const before = await client.fetch<Project[]>(
    '*[_type == "project"] | order(_id asc)',
  );
  assert.equal(before.length, 16);
  assert(!before.some((p) => p._id.startsWith("drafts.")));
  const changes: Record<string, Record<string, unknown>> = {
    "project-guchi-ganja-single-rollout-plan": { showInPortfolio: false },
    "project-garvicii-ep-content-plan": {
      ...EP_PUBLIC_FIELDS,
      role: [
        {
          _type: "block",
          _key: "ep-role",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "ep-role-text",
              marks: [],
              text: "Creative strategy & EP content planning",
            },
          ],
        },
      ],
    },
  };
  let transaction = client.transaction();
  let count = 0;
  for (const [id, fields] of Object.entries(changes)) {
    const project = before.find((p) => p._id === id);
    assert(project);
    if (
      !Object.entries(fields).every(([key, value]) =>
        isDeepStrictEqual(project[key], value),
      )
    ) {
      transaction = transaction.patch(id, (patch) =>
        patch.ifRevisionId(project._rev).set(fields),
      );
      count++;
    }
  }
  console.log(
    JSON.stringify(
      {
        commit: process.argv.includes("--commit"),
        changedRecords: count,
        changes,
      },
      null,
      2,
    ),
  );
  if (!process.argv.includes("--commit")) return;
  const directory = "../media-review/experience-repair";
  mkdirSync(directory, { recursive: true });
  if (count) {
    writeFileSync(
      `${directory}/corrections-before.json`,
      JSON.stringify(before, null, 2),
    );
    await transaction.commit({ visibility: "sync" });
  }
  const after = await client.fetch<Project[]>(
    '*[_type == "project"] | order(_id asc)',
  );
  assert.equal(after.length, 16);
  assert.equal(after.filter((p) => p.showInPortfolio !== false).length, 10);
  assert.deepEqual(
    after
      .filter((p) => p.showInPortfolio === false)
      .map((p) => p._id)
      .sort(),
    [...HIDDEN_PROJECT_IDS].sort(),
  );
  for (const previous of before) {
    const current = after.find((p) => p._id === previous._id);
    assert(current);
    const allowed = [
      "_rev",
      "_updatedAt",
      ...Object.keys(changes[previous._id] ?? {}),
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
    for (const [key, value] of Object.entries(changes[previous._id] ?? {}))
      assert.deepEqual(current[key], value);
  }
  writeFileSync(
    `${directory}/corrections-after.json`,
    JSON.stringify(after, null, 2),
  );
  console.log(
    "Verified: 16 retained, 10 public, 6 hidden; only approved fields changed; existing media unchanged.",
  );
}
void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
