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
            <p className="cms-state__eyebrow">Portfolio content unavailable</p>
            <h1>Ayomi&apos;s published profile is awaiting CMS configuration.</h1>
            <p>
              No placeholder biography or portrait has been substituted. Please
              reconnect the published Sanity Profile and rebuild the site.
            </p>
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
