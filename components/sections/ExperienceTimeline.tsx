import { Container } from "@/components/ui/Container";
import type {
  ExperienceQueryResult,
  ProfileQueryResult,
} from "@/sanity/sanity.types";

type ExperienceTimelineProps = {
  experience: ExperienceQueryResult;
  education: NonNullable<ProfileQueryResult>["education"];
};

function formatYears(entry: ExperienceQueryResult[number]) {
  if (entry.current) {
    return `${entry.startYear}—Now`;
  }

  return entry.endYear
    ? `${entry.startYear}—${entry.endYear}`
    : String(entry.startYear);
}

export function ExperienceTimeline({
  experience,
  education,
}: ExperienceTimelineProps) {
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
            <p>Selected roles from Ayomi&apos;s published experience.</p>
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

        {education && education.length > 0 ? (
          <section
            className="education-block"
            aria-labelledby="education-title"
          >
            <header>
              <p>Verified education</p>
              <h3 id="education-title">Education</h3>
            </header>
            <ul>
              {education.map((entry) => (
                <li key={entry._key}>
                  <p className="education-block__date">{entry.completion}</p>
                  <div>
                    <h4>{entry.institution}</h4>
                    <p>{entry.qualification}</p>
                    {entry.focus ? <p>{entry.focus}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </section>
  );
}
