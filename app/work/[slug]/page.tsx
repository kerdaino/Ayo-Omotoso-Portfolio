import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/ui/Container";
import {
  hasPortableText,
  PortableTextContent,
} from "@/components/work/PortableTextContent";
import {
  EvidenceGallery,
  type EvidenceImage,
} from "@/components/work/EvidenceGallery";
import { VideoGallery } from "@/components/work/VideoGallery";
import { PROJECT_STATUSES } from "@/sanity/constants";
import { urlForImage } from "@/sanity/image";
import { getAllProjects, getProfile, getProjectBySlug } from "@/sanity/queries";
import type { AllProjectsQueryResult } from "@/sanity/sanity.types";

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

type Project = AllProjectsQueryResult[number];

const EMPTY_PROJECT_SLUG = "__no-published-projects__";

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getAllProjects().catch((error: unknown) => {
    console.error(
      "Published project slugs could not be loaded during this build.",
      error,
    );
    return [];
  });

  if (projects.length === 0) {
    return [{ slug: EMPTY_PROJECT_SLUG }];
  }

  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === EMPTY_PROJECT_SLUG) {
    return { title: "Work" };
  }

  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project) {
    return { title: "Work" };
  }

  return {
    title: project.title,
    description: project.shortSummary,
    alternates: {
      canonical: `/work/${project.slug}/`,
    },
    openGraph: {
      title: project.title,
      description: project.shortSummary,
      url: `/work/${project.slug}/`,
      images: [],
    },
    twitter: {
      card: "summary",
      title: project.title,
      description: project.shortSummary,
      images: [],
    },
  };
}

function ProjectSection({
  title,
  value,
}: {
  title: string;
  value:
    | Project["projectContext"]
    | Project["brief"]
    | Project["role"]
    | Project["strategicApproach"]
    | Project["execution"]
    | Project["verifiedResults"];
}) {
  if (!hasPortableText(value)) {
    return null;
  }

  return (
    <section className="case-study__section">
      <h2>{title}</h2>
      <div className="case-study__prose">
        <PortableTextContent value={value ?? []} />
      </div>
    </section>
  );
}

function buildImageUrl(
  image: NonNullable<Project["coverImage"]>,
  width: number,
) {
  return (
    urlForImage(image)
      ?.width(width)
      .fit("max")
      .auto("format")
      .quality(86)
      .url() ?? null
  );
}

function evidenceImage(
  image: NonNullable<Project["coverImage"]>,
  key: string,
  alt: string,
  caption?: string | null,
): EvidenceImage | null {
  if (!alt.trim()) return null;
  const src = buildImageUrl(image, 1400);
  const enlargedSrc = buildImageUrl(image, 2400);
  if (!src || !enlargedSrc) return null;
  const dimensions = image.asset?._ref.match(/-(\d+)x(\d+)-/);
  return {
    key,
    src,
    enlargedSrc,
    alt,
    caption,
    width: Number(dimensions?.[1]) || 1400,
    height: Number(dimensions?.[2]) || 1050,
  };
}
function ProjectMedia({ project }: { project: Project }) {
  const groups = (project.evidenceSections ?? []).filter(
    (section) => section.publicApproved === true && section.images?.length,
  );
  const groupedRefs = new Set(
    groups.flatMap((section) =>
      (section.images ?? []).map((item) => item.image.asset?._ref),
    ),
  );
  const images = [
    ...(project.coverImage &&
    project.coverAlt &&
    !groupedRefs.has(project.coverImage.asset?._ref)
      ? [evidenceImage(project.coverImage, "cover", project.coverAlt)]
      : []),
    ...(groups.length ? [] : (project.gallery ?? []))
      .filter((item) => !groupedRefs.has(item.image.asset?._ref))
      .map((item) =>
        evidenceImage(item.image, item._key, item.alt, item.caption),
      ),
  ].filter((item): item is EvidenceImage => item !== null);
  const videos = (project.videos ?? [])
    .filter((video) => video.publicApproved === true)
    .map((video) => ({
      key: video._key,
      title: video.title,
      playbackUrl: video.playbackUrl,
      poster: video.poster ? buildImageUrl(video.poster, 1200) : null,
      posterAlt: video.posterAlt,
      caption: video.caption,
      portrait: project._id === "project-garvicii-shalewa",
    }));
  if (
    project.videoUrl &&
    !videos.some((video) => video.playbackUrl === project.videoUrl)
  )
    videos.push({
      key: "approved-video",
      portrait: false,
      title:
        project._id === "project-garvicii-jo"
          ? "Garvicii — JO (Official Video)"
          : `${project.title} — Video`,
      playbackUrl: project.videoUrl,
      poster: project.coverImage
        ? buildImageUrl(project.coverImage, 1200)
        : null,
      posterAlt: project.coverAlt ?? undefined,
      caption: undefined,
    });
  const videosFirst = project._id === "project-garvicii-shalewa";
  const technicalFirst = project.slug === "plug-and-play-set-design-options";
  const overview = images.length ? (
    <EvidenceGallery
      title={groups.length ? "Project overview" : videosFirst ? "Behind the scenes" : "Project imagery"}
      images={images}
    />
  ) : null;
  return (
    <>
      {videosFirst ? <VideoGallery videos={videos} /> : null}
      {!technicalFirst ? overview : null}
      {groups.map((section) => (
        <EvidenceGallery
          key={section._key}
          title={section.title || "Project evidence"}
          description={section.description}
          images={(section.images ?? [])
            .map((item) => evidenceImage(item.image, item._key, item.alt, item.caption))
            .filter((item): item is EvidenceImage => item !== null)}
        />
      ))}
      {technicalFirst ? overview : null}
      {!videosFirst ? <VideoGallery videos={videos} /> : null}
    </>
  );
}

function getNextProject(project: Project, projects: AllProjectsQueryResult) {
  const categoryProjects = projects
    .filter((item) => item.category === project.category)
    .toSorted(
      (a, b) =>
        (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999) ||
        a.title.localeCompare(b.title),
    );
  const currentIndex = categoryProjects.findIndex(
    (item) => item._id === project._id,
  );

  if (currentIndex < 0 || categoryProjects.length === 0) {
    return null;
  }

  return categoryProjects[(currentIndex + 1) % categoryProjects.length];
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;

  if (slug === EMPTY_PROJECT_SLUG) {
    notFound();
  }

  const [project, profile, allProjects] = await Promise.all([
    getProjectBySlug(slug).catch((error: unknown) => {
      console.error("The published project could not be loaded.", error);
      return null;
    }),
    getProfile().catch(() => null),
    getAllProjects().catch(() => []),
  ]);

  if (!project) {
    notFound();
  }

  const statusLabel =
    PROJECT_STATUSES.find((status) => status.value === project.status)?.title ??
    project.status;
  const categoryLabel =
    project.category === "culture" ? "Culture" : "Commerce / B2B";
  const nextProject = getNextProject(project, allProjects);

  return (
    <>
      <SiteHeader
        publicName={profile?.publicName}
        professionalTitle={profile?.professionalTitle}
        email={profile?.email}
      />
      <main id="main-content" className="case-study">
        <Container>
          <Link className="case-study__back" href="/#selected-work">
            <span aria-hidden="true">←</span> Selected Work
          </Link>

          <article>
            <header className={`case-study__hero${project._id === "project-garvicii-shalewa" ? " case-study__hero--video-first" : ""}`} data-status={project.status}>
              <div className="case-study__poster" aria-hidden="true">
                <span>{categoryLabel}</span>
                <strong>{project.title}</strong>
                {project.year ? <span>{project.year}</span> : null}
              </div>

              <div className="case-study__intro">
                <p className="case-study__status">{statusLabel}</p>
                <h1>{project.title}</h1>
                <dl className="case-study__metadata">
                  {project.year ? (
                    <div>
                      <dt>Year</dt>
                      <dd>{project.year}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>Category</dt>
                    <dd>{categoryLabel}</dd>
                  </div>
                  <div>
                    <dt>Work type</dt>
                    <dd>{project.workType}</dd>
                  </div>
                  {project.client ? (
                    <div>
                      <dt>Client / brand</dt>
                      <dd>{project.client}</dd>
                    </div>
                  ) : null}
                </dl>
                {project.skills && project.skills.length > 0 ? (
                  <div
                    className="case-study__skills"
                    aria-label="Professional skills"
                  >
                    {project.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                ) : null}
                <p className="case-study__summary">{project.shortSummary}</p>
                {project._id === "project-garvicii-shalewa" ? (
                  <a className="case-study__customer-story" href="#video-work">View all eight video productions ↓</a>
                ) : null}
                {project.category === "b2b"
                  ? project.externalLinks?.map((link) => (
                      <a
                        className="case-study__customer-story"
                        key={link._key}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View customer story <span aria-hidden="true">↗</span>
                      </a>
                    ))
                  : null}
              </div>
            </header>

            {project._id === "project-garvicii-shalewa" ? (
              <>
                <ProjectSection title="My role" value={project.role} />
                <ProjectMedia project={project} />
              </>
            ) : null}
            <div className="case-study__details">
              {project._id !== "project-garvicii-shalewa" ? <ProjectSection title="My role" value={project.role} /> : null}
              <ProjectSection
                title="Project context"
                value={project.projectContext}
              />
              <ProjectSection
                title="Brief / Project purpose"
                value={project.brief}
              />
              <ProjectSection
                title="Strategic approach"
                value={project.strategicApproach}
              />
              <ProjectSection
                title="Execution / Deliverables"
                value={project.execution}
              />
              <ProjectSection
                title="Outcomes"
                value={project.verifiedResults}
              />

              {project.collaborators && project.collaborators.length > 0 ? (
                <section className="case-study__section">
                  <h2>Collaborators / Credits</h2>
                  <ul className="case-study__credits">
                    {project.collaborators.map((collaborator) => (
                      <li key={collaborator._key}>
                        <strong>{collaborator.name}</strong>
                        {collaborator.role ? (
                          <span>{collaborator.role}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            {project._id !== "project-garvicii-shalewa" ? <ProjectMedia project={project} /> : null}

            {project.externalLinks && project.externalLinks.length > 0 ? (
              <section
                className="case-study__external-links"
                aria-labelledby="project-links-title"
              >
                <h2 id="project-links-title">
                  {project.category === "b2b"
                    ? "Customer story"
                    : "Public case study"}
                </h2>
                {project.externalLinks.map((link) => (
                  <a key={link._key} href={link.url}>
                    {project.category === "b2b"
                      ? "View customer story"
                      : link.label}{" "}
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </section>
            ) : null}
          </article>

          {nextProject ? (
            <nav className="case-study__next" aria-label="Next project">
              <Link href={`/work/${nextProject.slug}`}>
                <span>Next {categoryLabel} project</span>
                <strong>{nextProject.title}</strong>
                <span aria-hidden="true">→</span>
              </Link>
            </nav>
          ) : null}
        </Container>
      </main>
      {profile ? (
        <SiteFooter
          publicName={profile.publicName}
          professionalTitle={profile.professionalTitle}
          linkedInUrl={profile.linkedIn?.url ?? null}
        />
      ) : null}
    </>
  );
}
