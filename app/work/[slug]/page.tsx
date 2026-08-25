import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/ui/Container";
import { PROJECT_STATUSES } from "@/sanity/constants";
import {
  getAllProjects,
  getProfile,
  getProjectBySlug,
} from "@/sanity/queries";

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

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
    // Next.js static exports require at least one generated value for a dynamic
    // segment. This reserved build-only path immediately resolves to notFound()
    // and is never presented as a project or linked from the public portfolio.
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
    openGraph: {
      title: project.title,
      description: project.shortSummary,
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

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;

  if (slug === EMPTY_PROJECT_SLUG) {
    notFound();
  }

  const [project, profile] = await Promise.all([
    getProjectBySlug(slug).catch((error: unknown) => {
      console.error("The published project could not be loaded.", error);
      return null;
    }),
    getProfile().catch(() => null),
  ]);

  if (!project) {
    notFound();
  }

  const statusLabel =
    PROJECT_STATUSES.find((status) => status.value === project.status)?.title ??
    project.status;
  const categoryLabel =
    project.category === "culture" ? "Culture" : "Commerce";

  return (
    <>
      <SiteHeader
        publicName={profile?.publicName}
        professionalTitle={profile?.professionalTitle}
        email={profile?.email}
        resumeUrl={profile?.resume?.fileUrl ?? profile?.resume?.externalUrl}
      />
      <main id="main-content" className="work-foundation">
        <Container size="content">
          <Link className="work-foundation__back" href="/#selected-work">
            ← Back to Selected Work
          </Link>

          <article>
            <p className="work-foundation__eyebrow">
              {categoryLabel} / {project.workType} / {project.year}
            </p>
            <h1>{project.title}</h1>
            <p className="work-foundation__summary">{project.shortSummary}</p>

            <div className="work-foundation__status">
              <span>Editorial status</span>
              <strong>{statusLabel}</strong>
            </div>

            <aside className="work-foundation__notice">
              <p>Case study foundation</p>
              <h2>Full project details are not published yet.</h2>
              <p>
                This page will expand only when approved context, credits,
                media and outcomes are available in the CMS.
              </p>
            </aside>
          </article>
        </Container>
      </main>
    </>
  );
}
