import { Container } from "@/components/ui/Container";
import { siteProfile } from "@/lib/site";

export default function Home() {
  const [opening, closing] = siteProfile.heroStatement.split("Many Worlds");

  return (
    <main id="main-content" className="foundation-page">
      <section aria-labelledby="foundation-title">
        <Container className="foundation-intro">
          <p className="eyebrow">{siteProfile.professionalTitle}</p>
          <h1 id="foundation-title" className="display-title">
            {opening}
            <span>{`Many Worlds${closing}`}</span>
          </h1>
          <p className="foundation-intro__supporting">{siteProfile.supportingLine}</p>
          <div className="foundation-intro__accent" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </Container>
      </section>
    </main>
  );
}
