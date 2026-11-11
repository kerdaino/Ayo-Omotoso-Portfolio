import { Container } from "@/components/ui/Container";

const worlds = [
  {
    className: "two-worlds__panel--culture",
    number: "01",
    title: "Culture, Entertainment & Fashion",
    themes: [
      "Brand worlds",
      "Artist positioning",
      "Visual storytelling",
      "Content",
      "Live experiences",
      "Editorial thinking",
    ],
  },
  {
    className: "two-worlds__panel--commerce",
    number: "02",
    title: "B2B, Technology & Customer Marketing",
    themes: [
      "Campaign systems",
      "Customer stories",
      "Webinars",
      "Advocacy content",
      "Revenue-aligned marketing",
    ],
  },
] as const;

export function TwoWorlds() {
  return (
    <section className="two-worlds" aria-labelledby="two-worlds-title">
      <Container>
        <header className="two-worlds__header">
          <p>Range / 02</p>
          <h2 id="two-worlds-title">
            Two worlds.
            <em>One strategic mind.</em>
          </h2>
        </header>

        <div className="two-worlds__grid">
          {worlds.map((world) => (
            <article
              className={`two-worlds__panel ${world.className}`}
              key={world.title}
            >
              <span className="two-worlds__number" aria-hidden="true">
                {world.number}
              </span>
              <h3>{world.title}</h3>
              <ul>
                {world.themes.map((theme) => (
                  <li key={theme}>{theme}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="two-worlds__bridge">
          <span>Different contexts.</span> The same job: find the strongest
          idea, make it clear, and build the experience around it.
        </p>
      </Container>
    </section>
  );
}
