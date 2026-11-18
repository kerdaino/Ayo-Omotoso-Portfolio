import Link from "next/link";
import { Container } from "@/components/ui/Container";

// Grounded in Ayomi's supplied CV, original portfolios and the named public
// case studies. Project planning is not represented as executed production.
const capabilities = [
  {
    title: "Brand Strategy & Positioning",
    description: "Defines artist positioning, visual identity, messaging and public presentation. Her work connects a clear brand direction with the content and visual world around a release.",
    project: "Explore the Missbehave EP strategy and content plan",
    href: "/work/garvicii-ep-content-plan/",
  },
  {
    title: "Creative Direction",
    description: "Shapes the visual language of artist projects across styling, photography, artwork and video. For Garvicii’s JO, her contribution included creative direction, art direction and set design.",
    project: "See JO’s treatment references and executed production",
    href: "/work/garvicii-jo-creative-direction/",
  },
  {
    title: "Integrated Campaign Development",
    description: "Develops release campaigns from the brief and creative approach through content, publicity, partnerships and launch activity. The Missbehave case study shows her completed EP content planning, with proposed production clearly identified.",
    project: "Inspect the completed Missbehave planning work",
    href: "/work/garvicii-ep-content-plan/",
  },
  {
    title: "Content & Visual Storytelling",
    description: "Creates and produces visual content and original entertainment formats. Shalewa brings that work into view through eight scene productions and supporting behind-the-scenes imagery.",
    project: "Watch the eight Shalewa productions",
    href: "/work/garvicii-shalewa-visual-content/#video-work",
  },
  {
    title: "Event & Experiential Marketing",
    description: "Develops creative direction for concerts, brand activations and live experiences, including set design, staging and branded audience touchpoints. The Plug & Play case study presents three set-design proposals with technical drawings, inspiration boards and 3D concepts.",
    project: "Inspect the three Plug & Play set-design options",
    href: "/work/plug-and-play-set-design-options/",
  },
  {
    title: "Customer Marketing & Advocacy",
    description: "Produces customer case studies and advocacy content that turn product success into brand stories. Ayomi handled the featured WorkSpan customer case studies from start to finish; customer-company results remain distinct from her contribution.",
    project: "Explore Deepwatch’s customer story and Ayomi’s role",
    href: "/work/deepwatch-workspan/",
  },
  {
    title: "Partnerships & Audience Engagement",
    description: "Develops brand partnership concepts connecting brands with artists and entertainment formats. Her One Take Season 2 work is a completed sponsorship proposal, presenting integration ideas and partner value rather than claiming secured sponsorship.",
    project: "Open the One Take Season 2 partnership deck",
    href: "/work/one-take-sponsorship-deck/",
  },
] as const;

export function Capabilities() {
  return (
    <section id="capabilities" className="capabilities" aria-labelledby="capabilities-title">
      <Container>
        <header className="capabilities__header">
          <p>Capabilities / 04</p>
          <h2 id="capabilities-title">What Ayomi brings to the room.</h2>
        </header>
        <ol className="capabilities__list">
          {capabilities.map((capability, index) => (
            <li key={capability.title}>
              <details>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{capability.title}</strong>
                  <span className="capabilities__indicator" aria-hidden="true" />
                </summary>
                <div className="capabilities__content">
                  <p>{capability.description}</p>
                  <Link href={capability.href}>{capability.project} <span aria-hidden="true">↗</span></Link>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
