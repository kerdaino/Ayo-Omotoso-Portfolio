"use client";

import { useId, useRef, useState } from "react";

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

export function SelectedWork({ allProjects }: SelectedWorkProps) {
  const projects = deduplicateProjects(allProjects);
  const [activeSkill, setActiveSkill] = useState<ProjectSkill | "all" | null>(
    null,
  );
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const featuredIds = [
    "project-garvicii-jo",
    "project-deepwatch-workspan",
    "project-plug-and-play-set-design-options",
    "project-one-take-sponsorship-deck",
  ];
  const featured = featuredIds.flatMap((id, index) => {
    const project = projects.find(
      (item) => item._id === id && item.skills?.includes(PROJECT_SKILLS[index]),
    );
    return project ? [{ project, skill: PROJECT_SKILLS[index] }] : [];
  });
  function selectSkill(skill: ProjectSkill | "all" | null, focus = false) {
    setActiveSkill(skill);
    if (focus)
      requestAnimationFrame(() => {
        resultsHeading.current?.focus({ preventScroll: true });
        resultsHeading.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
  }
  const filterHeadingId = useId();
  const visibleProjects =
    activeSkill && activeSkill !== "all"
      ? projects.filter((project) => project.skills?.includes(activeSkill))
      : projects;
  const activeLabel =
    activeSkill === "all" ? "All Work" : (activeSkill ?? "Featured Work");

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
            <h2 id="selected-work-title">Featured Work</h2>
            <p>Explore my work by discipline.</p>
          </div>
        </header>

        {projects.length === 0 ? (
          <div className="selected-work__empty">
            <p>Selected work is being prepared for publication.</p>
          </div>
        ) : (
          <div className="selected-work__browser">
            <div className="work-filters" aria-labelledby={filterHeadingId}>
              <p id={filterHeadingId}>Browse by skill</p>
              <div className="work-filters__controls">
                <button
                  type="button"
                  aria-pressed={activeSkill === null}
                  onClick={() => selectSkill(null)}
                >
                  Featured Work
                </button>
                {PROJECT_SKILLS.map((skill) => (
                  <button
                    type="button"
                    aria-pressed={activeSkill === skill}
                    key={skill}
                    onClick={() => selectSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
                <button
                  type="button"
                  aria-pressed={activeSkill === "all"}
                  onClick={() => selectSkill("all")}
                >
                  All Work
                </button>
              </div>
            </div>

            <section
              className="work-category"
              aria-labelledby="visible-work-title"
            >
              <header className="work-category__header">
                <span aria-hidden="true">01</span>
                <h3 id="visible-work-title" ref={resultsHeading} tabIndex={-1}>
                  {activeLabel}
                </h3>
                <p aria-live="polite">
                  {activeSkill === null
                    ? featured.length
                    : visibleProjects.length}
                  {" projects"}
                </p>
              </header>

              {activeSkill === null ? (
                <div className="work-category__grid">
                  {featured.map(({ project, skill }) => (
                    <div className="featured-work" key={skill}>
                      <p className="featured-work__discipline">{skill}</p>
                      <ProjectCard project={project} />
                      <button
                        className="work-explore"
                        type="button"
                        onClick={() => selectSkill(skill, true)}
                      >
                        Explore {skill} <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : visibleProjects.length > 0 ? (
                <div className="work-category__grid">
                  {visibleProjects.map((project) => (
                    <ProjectCard project={project} key={project._id} />
                  ))}
                </div>
              ) : (
                <p className="work-category__empty">
                  No projects to show for this skill yet.
                </p>
              )}
            </section>
          </div>
        )}
      </Container>
    </section>
  );
}
