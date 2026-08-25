import { SiteHeader } from "@/components/layout/SiteHeader";
import { Hero } from "@/components/sections/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Container } from "@/components/ui/Container";
import {
  getAllProjects,
  getFeaturedProjects,
  getProfile,
} from "@/sanity/queries";

export default async function Home() {
  const [profile, featuredProjects, allProjects] = await Promise.all([
    getProfile().catch((error: unknown) => {
      console.error(
        "The published Sanity Profile could not be loaded during this build.",
        error,
      );
      return null;
    }),
    getFeaturedProjects().catch((error: unknown) => {
      console.error(
        "Featured projects could not be loaded during this build.",
        error,
      );
      return [];
    }),
    getAllProjects().catch((error: unknown) => {
      console.error(
        "Published projects could not be loaded during this build.",
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
            <h1>Ayo&apos;s published profile is awaiting CMS configuration.</h1>
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
        resumeUrl={profile.resume?.fileUrl ?? profile.resume?.externalUrl}
      />
      <main id="main-content">
        <Hero profile={profile} />
        <ProofStrip />
        <SelectedWork
          featuredProjects={featuredProjects}
          allProjects={allProjects}
        />
      </main>
    </>
  );
}
