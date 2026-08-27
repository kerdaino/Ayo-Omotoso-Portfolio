import Link from "next/link";

import { Container } from "@/components/ui/Container";

type SiteFooterProps = {
  publicName: string;
  professionalTitle: string;
  linkedInUrl: string | null;
};

export function SiteFooter({
  publicName,
  professionalTitle,
  linkedInUrl,
}: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <Container className="site-footer__inner">
        <div>
          <p className="site-footer__name">{publicName}</p>
          <p className="site-footer__role">{professionalTitle}</p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="site-footer__nav">
            <li>
              <Link href="/#selected-work">Selected Work</Link>
            </li>
            <li>
              <Link href="/#about">About</Link>
            </li>
            <li>
              <Link href="/resume">Resume</Link>
            </li>
            <li>
              <Link href="/#contact">Contact</Link>
            </li>
          </ul>
        </nav>

        {linkedInUrl ? (
          <a
            className="site-footer__linkedin"
            href={linkedInUrl}
            rel="noreferrer"
          >
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </Container>
    </footer>
  );
}
