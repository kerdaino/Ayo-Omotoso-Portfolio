import Link from "next/link";

import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Container } from "@/components/ui/Container";

type SiteHeaderProps = {
  publicName?: string;
  professionalTitle?: string;
  email?: string | null;
  resumeUrl?: string | null;
};

function PendingNavigationItem({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="site-nav__link site-nav__link--pending"
      aria-disabled="true"
      title="This destination will be published in a later phase."
    >
      {children}
      <span className="sr-only"> — not yet published</span>
    </span>
  );
}

export function SiteHeader({
  publicName,
  professionalTitle,
  email,
  resumeUrl,
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Container className="site-header__inner">
        {publicName ? (
          <Link
            className="site-brand"
            href="/"
            aria-label={`${publicName}, home`}
          >
            <span>{publicName}</span>
            {professionalTitle ? (
              <span className="site-brand__role">{professionalTitle}</span>
            ) : null}
          </Link>
        ) : (
          <span className="site-brand">Portfolio</span>
        )}

        <nav
          className="site-nav site-nav--desktop"
          aria-label="Primary navigation"
        >
          <ul className="site-nav__list">
            <li>
              <PendingNavigationItem>Selected Work</PendingNavigationItem>
            </li>
            <li>
              <PendingNavigationItem>About</PendingNavigationItem>
            </li>
            <li>
              {resumeUrl ? (
                <a className="site-nav__link" href={resumeUrl}>
                  Resume
                </a>
              ) : (
                <PendingNavigationItem>Resume</PendingNavigationItem>
              )}
            </li>
            <li>
              {email ? (
                <a
                  className="site-nav__link site-nav__link--contact"
                  href={`mailto:${email}`}
                >
                  Contact
                </a>
              ) : (
                <PendingNavigationItem>Contact</PendingNavigationItem>
              )}
            </li>
          </ul>
        </nav>

        <MobileNavigation email={email} resumeUrl={resumeUrl} />
      </Container>
    </header>
  );
}
