import { ProjectCard } from "@/components/work/ProjectCard";
import { Container } from "@/components/ui/Container";
import type {
  AllProjectsQueryResult,
  FeaturedProjectsQueryResult,
} from "@/sanity/sanity.types";

type SelectedWorkProps = {
  featuredProjects: FeaturedProjectsQueryResult;
  allProjects: AllProjectsQueryResult;
};

type ProjectSummary = AllProjectsQueryResult[number];

const categories = [
  { value: "culture", title: "Culture" },
  { value: "b2b", title: "Commerce" },
] as const;

function mergeProjects(
  featuredProjects: FeaturedProjectsQueryResult,
  allProjects: AllProjectsQueryResult,
) {
  const seenProjectIds = new Set<string>();
  const projects: ProjectSummary[] = [];

  for (const project of [...featuredProjects, ...allProjects]) {
    if (seenProjectIds.has(project._id)) {
      continue;
    }

    seenProjectIds.add(project._id);
    projects.push(project);
  }

  return projects;
}

export function SelectedWork({
  featuredProjects,
  allProjects,
}: SelectedWorkProps) {
  const projects = mergeProjects(featuredProjects, allProjects);

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
          <div className="selected-work__categories">
            {categories.map((category, categoryIndex) => {
              const categoryProjects = projects.filter(
                (project) => project.category === category.value,
              );

              if (categoryProjects.length === 0) {
                return null;
              }

              const categoryId = `selected-work-${category.value}`;

              return (
                <section
                  className="work-category"
                  key={category.value}
                  aria-labelledby={categoryId}
                >
                  <header className="work-category__header">
                    <span aria-hidden="true">
                      {String(categoryIndex + 1).padStart(2, "0")}
                    </span>
                    <h3 id={categoryId}>{category.title}</h3>
                    <p>
                      {categoryProjects.length}{" "}
                      {categoryProjects.length === 1 ? "project" : "projects"}
                    </p>
                  </header>

                  <div className="work-category__grid">
                    {categoryProjects.map((project) => (
                      <ProjectCard project={project} key={project._id} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
