import { Container } from "@/components/ui/Container";

type AboutProps = {
  shortBio: string;
};

const careerFragments = [
  "8+ years",
  "Culture + commerce",
  "Strategy to launch",
] as const;

export function About({ shortBio }: AboutProps) {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <Container>
        <div className="about__layout">
          <header className="about__heading">
            <p>About / 03</p>
            <h2 id="about-title">
              Creative instinct,
              <em>commercial thinking.</em>
            </h2>
          </header>

          <div className="about__story">
            <p>{shortBio}</p>
            <ul aria-label="Career at a glance">
              {careerFragments.map((fragment, index) => (
                <li key={fragment}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {fragment}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
