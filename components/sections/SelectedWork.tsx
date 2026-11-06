"use client";

import { useId, useState } from "react";

import { ProjectCard } from "@/components/work/ProjectCard";
import { Container } from "@/components/ui/Container";
import { PROJECT_SKILLS, type ProjectSkill } from "@/sanity/constants";
import type { AllProjectsQueryResult } from "@/sanity/sanity.types";

type SelectedWorkProps = {
  allProjects: AllProjectsQueryResult;
};

type ProjectSummary = AllProjectsQueryResult[number];

function deduplicateProjects(allProjects: AllProjectsQueryResult) {
  const seenProjectIds = new Set<string>();
  const projects: ProjectSummary[] = [];

  for (const project of allProjects) {
    if (seenProjectIds.has(project._id)) {
      continue;
    }

    seenProjectIds.add(project._id);
    projects.push(project);
  }

  return projects;
}

export function SelectedWork({
  allProjects,
}: SelectedWorkProps) {
  const projects = deduplicateProjects(allProjects);
  const [activeSkill, setActiveSkill] = useState<ProjectSkill | null>(null);
  const filterHeadingId = useId();
  const visibleProjects = activeSkill
    ? projects.filter((project) => project.skills?.includes(activeSkill))
    : projects;
  const activeLabel = activeSkill ?? "All Work";

  return (
    <section
      id="selected-work"
      className="selected-work"
      aria-labelledby="selected-work-title"
    >
      <Container>
        <header className="selected-work__header">
          <p>Portfolio / 01</p>
          <div>
            <h2 id="selected-work-title">Selected Work</h2>
            <p>Published projects, organised by practice.</p>
          </div>
        </header>

        {projects.length === 0 ? (
          <div className="selected-work__empty">
            <p>Selected work is being prepared for publication.</p>
            <span>No project entries are published in the CMS yet.</span>
          </div>
        ) : (
          <div className="selected-work__browser">
            <div className="work-filters" aria-labelledby={filterHeadingId}>
              <p id={filterHeadingId}>Browse by skill</p>
              <div className="work-filters__controls">
                <button
                  type="button"
                  aria-pressed={activeSkill === null}
                  onClick={() => setActiveSkill(null)}
                >
                  All Work
                </button>
                {PROJECT_SKILLS.map((skill) => (
                  <button
                    type="button"
                    aria-pressed={activeSkill === skill}
                    key={skill}
                    onClick={() => setActiveSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <section
              className="work-category"
              aria-labelledby="visible-work-title"
            >
              <header className="work-category__header">
                <span aria-hidden="true">01</span>
                <h3 id="visible-work-title">{activeLabel}</h3>
                <p aria-live="polite">
                  {visibleProjects.length}{" "}
                  {visibleProjects.length === 1 ? "project" : "projects"}
                </p>
              </header>

              {visibleProjects.length > 0 ? (
                <div className="work-category__grid">
                  {visibleProjects.map((project) => (
                    <ProjectCard project={project} key={project._id} />
                  ))}
                </div>
              ) : (
                <p className="work-category__empty">
                  No published projects are assigned to this skill yet.
                </p>
              )}
            </section>
          </div>
        )}
      </Container>
    </section>
  );
}
