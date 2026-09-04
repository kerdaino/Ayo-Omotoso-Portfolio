import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/ui/Container";
import {
  founderEditorialOrganisations,
  primaryExperienceOrganisations,
  verifiedCertifications,
} from "@/lib/resume";
import { siteProfile } from "@/lib/site";
import { getExperience, getProfile } from "@/sanity/queries";
import type { ExperienceQueryResult } from "@/sanity/sanity.types";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Verified professional experience, education and certifications for Ayomi Omotoso.",
  alternates: {
    canonical: "/resume/",
  },
  openGraph: {
    title: "Resume — Ayomi Omotoso",
    description:
      "Verified professional experience, education and certifications for Ayomi Omotoso.",
    url: "/resume/",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Resume — Ayomi Omotoso",
    description:
      "Verified professional experience, education and certifications for Ayomi Omotoso.",
    images: [],
  },
};

function formatYears(entry: ExperienceQueryResult[number]) {
  return entry.current
    ? `${entry.startYear}—Present`
    : entry.endYear
      ? `${entry.startYear}—${entry.endYear}`
      : String(entry.startYear);
}

function orderedEntries(
  experience: ExperienceQueryResult,
  organisations: readonly string[],
) {
  return organisations.flatMap((organisation) => {
    const entry = experience.find(
      (item) => item.organisation === organisation,
    );
    return entry ? [entry] : [];
  });
}

function ExperienceList({ entries }: { entries: ExperienceQueryResult }) {
  return (
    <ol className="resume-list">
      {entries.map((entry) => (
        <li key={entry._id}>
          <p className="resume-list__date">{formatYears(entry)}</p>
          <div>
            <h3>{entry.role}</h3>
            <p>{entry.organisation}</p>
            {entry.shortDescription ? <p>{entry.shortDescription}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default async function ResumePage() {
  const [profile, experience] = await Promise.all([
    getProfile().catch(() => null),
    getExperience().catch(() => []),
  ]);
  const primaryExperience = orderedEntries(
    experience,
    primaryExperienceOrganisations,
  );
  const founderEditorial = orderedEntries(
    experience,
    founderEditorialOrganisations,
  );
  const publicName = profile?.publicName ?? siteProfile.publicName;
  const professionalTitle =
    profile?.professionalTitle ?? siteProfile.professionalTitle;
  const email = profile?.email ?? siteProfile.email;

  return (
    <>
      <SiteHeader
        publicName={publicName}
        professionalTitle={professionalTitle}
        email={email}
      />
      <main id="main-content" className="resume-page">
        <Container>
          <header className="resume-page__hero">
            <p>Verified CV / Resume</p>
            <h1>{publicName}</h1>
            <div>
              <p>{professionalTitle}</p>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          </header>

          <div className="resume-page__body">
            {profile?.shortBio ? (
              <section aria-labelledby="resume-summary-title">
                <p className="resume-section__eyebrow">01 / Profile</p>
                <h2 id="resume-summary-title">Professional Summary</h2>
                <p className="resume-page__summary">{profile.shortBio}</p>
              </section>
            ) : null}

            {primaryExperience.length > 0 ? (
              <section aria-labelledby="resume-experience-title">
                <p className="resume-section__eyebrow">02 / Work</p>
                <h2 id="resume-experience-title">Experience</h2>
                <ExperienceList entries={primaryExperience} />
              </section>
            ) : null}

            {founderEditorial.length > 0 ? (
              <section aria-labelledby="resume-leadership-title">
                <p className="resume-section__eyebrow">03 / Leadership</p>
                <h2 id="resume-leadership-title">
                  Founder / Editorial Leadership
                </h2>
                <ExperienceList entries={founderEditorial} />
              </section>
            ) : null}

            {profile?.education && profile.education.length > 0 ? (
              <section aria-labelledby="resume-education-title">
                <p className="resume-section__eyebrow">04 / Learning</p>
                <h2 id="resume-education-title">Education</h2>
                <ol className="resume-list">
                  {profile.education.map((entry) => (
                    <li key={entry._key}>
                      <p className="resume-list__date">{entry.completion}</p>
                      <div>
                        <h3>{entry.institution}</h3>
                        <p>{entry.qualification}</p>
                        {entry.focus ? <p>{entry.focus}</p> : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            <section aria-labelledby="resume-certifications-title">
              <p className="resume-section__eyebrow">05 / Training</p>
              <h2 id="resume-certifications-title">Certifications</h2>
              <ul className="resume-certifications">
                {verifiedCertifications.map((certification, index) => (
                  <li key={certification}>
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p>{certification}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </Container>
      </main>
      <SiteFooter
        publicName={publicName}
        professionalTitle={professionalTitle}
        linkedInUrl={profile?.linkedIn?.url ?? null}
      />
    </>
  );
}
