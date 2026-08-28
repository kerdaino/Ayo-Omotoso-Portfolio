import type { ProfileQueryResult } from "@/sanity/sanity.types";
import { urlForImage } from "@/sanity/image";

import { ParallaxArtwork } from "@/components/motion/ParallaxArtwork";
import { ActionLink } from "@/components/ui/ActionLink";
import { Container } from "@/components/ui/Container";

type HeroProps = {
  profile: NonNullable<ProfileQueryResult>;
};

function buildPortraitUrl(
  profile: NonNullable<ProfileQueryResult>,
  width: number,
) {
  if (!profile.portrait) {
    return null;
  }

  return (
    urlForImage(profile.portrait)
      ?.width(width)
      .height(Math.round(width * 1.25))
      .fit("crop")
      .crop("center")
      .auto("format")
      .quality(86)
      .url() ?? null
  );
}

export function Hero({ profile }: HeroProps) {
  const portraitSmall = buildPortraitUrl(profile, 480);
  const portraitMedium = buildPortraitUrl(profile, 800);
  const portraitLarge = buildPortraitUrl(profile, 1100);
  const statementParts = profile.heroStatement.split(/,(.+)/).filter(Boolean);
  const openingStatement = statementParts[0];
  const closingStatement = statementParts[1]?.trim();

  if (!portraitSmall || !portraitMedium || !portraitLarge) {
    return null;
  }

  return (
    <section className="hero" aria-labelledby="hero-title">
      <Container className="hero__grid">
        <div className="hero__copy">
          <div className="hero__identity">
            <p className="hero__name">{profile.publicName}</p>
            <p className="hero__role">{profile.professionalTitle}</p>
          </div>

          <h1 id="hero-title" className="hero__title">
            <span>
              {openingStatement}
              {closingStatement ? "," : ""}
            </span>
            {closingStatement ? <em>{closingStatement}</em> : null}
          </h1>

          <p className="hero__supporting">{profile.supportingLine}</p>
        </div>

        <ParallaxArtwork>
          <svg
            className="hero-artwork__arrow"
            data-parallax-layer="far"
            viewBox="0 0 130 84"
            aria-hidden="true"
          >
            <path d="M8 62c30-49 71-51 107-26" />
            <path d="m99 17 18 20-25 7" />
          </svg>

          <div
            className="hero-artwork__portrait"
            data-parallax-layer="portrait"
          >
            <picture>
              <source
                media="(max-width: 38rem)"
                srcSet={`${portraitSmall} 480w, ${portraitMedium} 800w`}
                sizes="calc(100vw - 3rem)"
              />
              <source
                srcSet={`${portraitMedium} 800w, ${portraitLarge} 1100w`}
                sizes="(max-width: 64rem) 52vw, 40vw"
              />
              <img
                src={portraitLarge}
                alt={profile.portraitAlt ?? ""}
                width="1100"
                height="1375"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>

          <span
            className="hero-artwork__tape"
            data-parallax-layer="near"
            aria-hidden="true"
          />

          <aside
            className="hero-artwork__note"
            data-parallax-layer="near"
            aria-label="Creative themes"
          >
            <span>Strategy</span>
            <span>Story</span>
            <span>Culture</span>
            <span>Impact</span>
          </aside>

          <p
            className="hero-artwork__scrap"
            data-parallax-layer="mid"
            aria-hidden="true"
          >
            Ideas into
            <br />
            impact.
          </p>

          <p
            className="hero-artwork__badge"
            data-parallax-layer="near"
            aria-hidden="true"
          >
            Culture <span>↔</span> Commerce
          </p>
        </ParallaxArtwork>

        <div className="hero__actions" aria-label="Portfolio actions">
          <ActionLink href="#selected-work">View Selected Work</ActionLink>
          <ActionLink href="#about" variant="secondary">
            About Ayo
          </ActionLink>
        </div>
      </Container>
    </section>
  );
}
