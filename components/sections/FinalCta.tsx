import { Container } from "@/components/ui/Container";

type FinalCtaProps = {
  email: string | null;
  linkedInUrl: string | null;
};

export function FinalCta({ email, linkedInUrl }: FinalCtaProps) {
  return (
    <section id="contact" className="final-cta" aria-labelledby="cta-title">
      <Container>
        <p className="final-cta__eyebrow">Have an idea worth building?</p>
        <h2 id="cta-title">LET&apos;S BUILD SOMETHING PEOPLE REMEMBER.</h2>
        <div className="final-cta__actions">
          {email ? (
            <a
              className="action-link action-link--primary"
              href={`mailto:${email}`}
            >
              Email Ayomi
              <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          {linkedInUrl ? (
            <a
              className="action-link action-link--secondary"
              href={linkedInUrl}
              rel="noreferrer"
            >
              LinkedIn
              <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
