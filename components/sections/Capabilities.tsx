import { Container } from "@/components/ui/Container";

const capabilities = [
  "Brand Strategy & Positioning",
  "Creative Direction",
  "Integrated Campaign Development",
  "Content & Visual Storytelling",
  "Event & Experiential Marketing",
  "Customer Marketing & Advocacy",
  "Partnerships & Audience Engagement",
] as const;

export function Capabilities() {
  return (
    <section className="capabilities" aria-labelledby="capabilities-title">
      <Container>
        <header className="capabilities__header">
          <p>Capabilities / 04</p>
          <h2 id="capabilities-title">What Ayo brings to the room.</h2>
        </header>

        <ol className="capabilities__list">
          {capabilities.map((capability, index) => (
            <li key={capability}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{capability}</strong>
              <span aria-hidden="true">↗</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
