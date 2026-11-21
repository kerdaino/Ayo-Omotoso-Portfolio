"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

const capabilities = [
  {
    title: "Brand Strategy & Positioning",
    description: "I define how artists present themselves, from positioning and messaging to the visual identity and content around a release.",
    project: "Explore the Missbehave EP strategy and content plan",
    href: "/work/garvicii-ep-content-plan/",
  },
  {
    title: "Creative Direction",
    description: "I shape how artist projects look and feel across styling, photography, artwork and video. For Garvicii’s JO, my work covered creative direction, art direction and set design.",
    project: "Explore the JO treatment and production",
    href: "/work/garvicii-jo-creative-direction/",
  },
  {
    title: "Integrated Campaign Development",
    description: "I develop release campaigns from the initial brief through content, publicity, partnerships and launch planning. For Missbehave, I put together the EP content plan and proposed rollout.",
    project: "Explore the Missbehave rollout plan",
    href: "/work/garvicii-ep-content-plan/",
  },
  {
    title: "Content & Visual Storytelling",
    description: "I create and produce visual content and entertainment formats. For Shalewa, I worked across eight visual interpretations of the same song.",
    project: "Watch the eight Shalewa productions",
    href: "/work/garvicii-shalewa-visual-content/#video-work",
  },
  {
    title: "Event & Experiential Marketing",
    description: "I develop creative direction for concerts, brand activations and live experiences. For Plug & Play, I developed three studio set concepts, each with an inspiration board, technical drawings and a 3D visualisation.",
    project: "See the three Plug & Play set concepts",
    href: "/work/plug-and-play-set-design-options/",
  },
  {
    title: "Customer Marketing & Advocacy",
    description: "I produce customer stories and advocacy content. At WorkSpan, I took the four case studies in this portfolio from start to finish, focusing on how each customer used the platform.",
    project: "Read the Deepwatch customer story",
    href: "/work/deepwatch-workspan/",
  },
  {
    title: "Partnerships & Audience Engagement",
    description: "I develop partnership concepts that bring brands into artist and entertainment projects. For One Take Season 2, I proposed how sponsors could take part in the series.",
    project: "Open the One Take Season 2 partnership deck",
    href: "/work/one-take-sponsorship-deck/",
  },
] as const;

function CapabilityCard({ capability, index }: {
  capability: (typeof capabilities)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = `capability-${index + 1}`;

  return (
    <li>
      <h3 className="capabilities__heading">
        <button
          type="button"
          className="capabilities__toggle"
          id={`${id}-button`}
          aria-expanded={expanded}
          aria-controls={`${id}-panel`}
          onClick={() => setExpanded(!expanded)}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{capability.title}</strong>
          <span className="capabilities__indicator" aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        className="capabilities__panel"
        data-expanded={expanded}
        role="region"
        aria-labelledby={`${id}-button`}
        aria-hidden={!expanded}
        inert={!expanded}
      >
        <div className="capabilities__clip">
          <div className="capabilities__content">
            <p>{capability.description}</p>
            <Link href={capability.href}>{capability.project}</Link>
          </div>
        </div>
      </div>
    </li>
  );
}

export function Capabilities() {
  return (
    <section id="capabilities" className="capabilities" aria-labelledby="capabilities-title">
      <Container>
        <header className="capabilities__header">
          <p>Capabilities / 04</p>
          <h2 id="capabilities-title">What I bring to the room.</h2>
        </header>
        <ol className="capabilities__list">
          {capabilities.map((capability, index) => (
            <CapabilityCard key={capability.title} capability={capability} index={index} />
          ))}
        </ol>
      </Container>
    </section>
  );
}
