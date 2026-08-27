import Link from "next/link";

import type { AllProjectsQueryResult } from "@/sanity/sanity.types";
import { PROJECT_STATUSES } from "@/sanity/constants";
import { urlForImage } from "@/sanity/image";

type ProjectSummary = AllProjectsQueryResult[number];

type ProjectCardProps = {
  project: ProjectSummary;
};

const categoryLabels: Record<ProjectSummary["category"], string> = {
  culture: "Culture",
  b2b: "Commerce",
};

function buildCoverUrl(project: ProjectSummary, width: number) {
  if (!project.coverImage) {
    return null;
  }

  return (
    urlForImage(project.coverImage)
      ?.width(width)
      .height(Math.round(width * 0.75))
      .fit("crop")
      .auto("format")
      .quality(84)
      .url() ?? null
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  const coverSmall = buildCoverUrl(project, 640);
  const coverLarge = buildCoverUrl(project, 1200);
  const hasAccessibleCover = Boolean(
    coverSmall && coverLarge && project.coverAlt?.trim(),
  );
  const statusLabel =
    PROJECT_STATUSES.find((status) => status.value === project.status)?.title ??
    project.status;

  return (
    <Link
      className="project-card"
      href={`/work/${project.slug}`}
      data-status={project.status}
      aria-label={`View ${project.title}`}
    >
      <article>
        <div className="project-card__media">
          {hasAccessibleCover ? (
            <picture>
              <source
                srcSet={`${coverSmall} 640w, ${coverLarge} 1200w`}
                sizes="(max-width: 48rem) calc(100vw - 2rem), 45vw"
              />
              <img
                src={coverLarge ?? undefined}
                alt={project.coverAlt ?? ""}
                width="1200"
                height="900"
                loading="lazy"
                decoding="async"
              />
            </picture>
          ) : (
            <div className="project-card__media-state">
              <span>Project image</span>
              <strong>Not published</strong>
            </div>
          )}

          <span className="project-card__status">{statusLabel}</span>
          {project.featured ? (
            <span className="project-card__featured">Featured</span>
          ) : null}
        </div>

        <div className="project-card__body">
          <p className="project-card__meta">
            <span>{categoryLabels[project.category]}</span>
            <span aria-hidden="true">/</span>
            <span>{project.workType}</span>
            {project.year ? (
              <>
                <span aria-hidden="true">/</span>
                <time>{project.year}</time>
              </>
            ) : null}
          </p>

          <div className="project-card__heading">
            <h4>{project.title}</h4>
            <span aria-hidden="true">↗</span>
          </div>

          <p className="project-card__summary">{project.shortSummary}</p>
        </div>
      </article>
    </Link>
  );
}
