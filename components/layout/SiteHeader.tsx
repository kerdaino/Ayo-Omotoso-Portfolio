import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { siteProfile } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Container className="site-header__inner">
        <Link className="site-brand" href="/" aria-label={`${siteProfile.publicName}, home`}>
          <span>{siteProfile.publicName}</span>
          <span className="site-brand__role">{siteProfile.professionalTitle}</span>
        </Link>

        <p className="site-header__cue" aria-label="Culture to commerce">
          Culture <span aria-hidden="true">↔</span> Commerce
        </p>
      </Container>
    </header>
  );
}

