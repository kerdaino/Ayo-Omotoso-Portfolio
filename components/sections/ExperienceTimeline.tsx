import { Container } from "@/components/ui/Container";
import type { ExperienceQueryResult } from "@/sanity/sanity.types";

type ExperienceTimelineProps = {
  experience: ExperienceQueryResult;
};

function formatYears(entry: ExperienceQueryResult[number]) {
  if (entry.current) {
    return `${entry.startYear}—Now`;
  }

  return entry.endYear
    ? `${entry.startYear}—${entry.endYear}`
    : String(entry.startYear);
}

export function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  return (
    <section
      id="experience"
      className="experience"
      aria-labelledby="experience-title"
    >
      <Container>
        <header className="experience__header">
          <p>Experience / 05</p>
          <div>
            <h2 id="experience-title">A career built across worlds.</h2>
            <p>Selected roles from Ayo&apos;s published experience.</p>
          </div>
        </header>

        {experience.length > 0 ? (
          <ol className="experience__timeline">
            {experience.map((entry, index) => (
              <li key={entry._id}>
                <span className="experience__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="experience__years">{formatYears(entry)}</p>
                <div className="experience__role">
                  <h3>{entry.role}</h3>
                  <p>{entry.organisation}</p>
                  {entry.shortDescription ? (
                    <p className="experience__description">
                      {entry.shortDescription}
                    </p>
                  ) : null}
                  {entry.location ? (
                    <p className="experience__location">{entry.location}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="experience__empty">
            Published experience is temporarily unavailable.
          </p>
        )}
      </Container>
    </section>
  );
}
