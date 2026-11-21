import type { Metadata } from "next";

import { siteDescription, siteProfile } from "@/lib/site";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { TwoWorlds } from "@/components/sections/TwoWorlds";
import { Container } from "@/components/ui/Container";
import {
  getAllProjects,
  getExperience,
  getProfile,
} from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => null);
  const publicName = profile?.publicName ?? siteProfile.publicName;
  const professionalTitle = profile?.professionalTitle ?? siteProfile.professionalTitle;
  const title = profile?.seo?.title?.trim() || `${publicName} — ${professionalTitle}`;
  const description = profile?.seo?.description?.trim() || siteDescription;

  return {
    title: { absolute: title },
    description,
    openGraph: { type: "website", siteName: publicName, title, description, url: "/", images: [] },
    twitter: { card: "summary", title, description, images: [] },
  };
}

export default async function Home() {
  const [profile, allProjects, experience] = await Promise.all([
      getProfile().catch((error: unknown) => {
        console.error(
          "The published Sanity Profile could not be loaded during this build.",
          error,
        );
        return null;
      }),
      getAllProjects().catch((error: unknown) => {
        console.error(
          "Published projects could not be loaded during this build.",
          error,
        );
        return [];
      }),
      getExperience().catch((error: unknown) => {
        console.error(
          "Published experience could not be loaded during this build.",
          error,
        );
        return [];
      }),
    ]);

  if (!profile?.portrait || !profile.portraitAlt) {
    return (
      <>
        <SiteHeader />
        <main id="main-content" className="cms-state">
          <Container size="content">
            <h1>My portfolio is temporarily unavailable.</h1>
          </Container>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader
        publicName={profile.publicName}
        professionalTitle={profile.professionalTitle}
        email={profile.email}
      />
      <main id="main-content">
        <Hero profile={profile} />
        <ProofStrip />
        <SelectedWork allProjects={allProjects} />
        <TwoWorlds />
        {profile.shortBio ? <About shortBio={profile.shortBio} /> : null}
        <Capabilities />
        <ExperienceTimeline
          experience={experience}
          education={profile.education}
        />
        <FinalCta
          email={profile.email}
          linkedInUrl={profile.linkedIn?.url ?? null}
        />
      </main>
      <SiteFooter
        publicName={profile.publicName}
        professionalTitle={profile.professionalTitle}
        linkedInUrl={profile.linkedIn?.url ?? null}
      />
    </>
  );
}
