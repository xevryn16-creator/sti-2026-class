import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/layout/HeroSection";
import Container from "@/components/foundation/Container";
import Section from "@/components/foundation/Section";
import SectionHeading from "@/components/foundation/SectionHeading";
import ClassIdentity from "@/components/content/ClassIdentity";
import StudentGrid from "@/components/content/StudentGrid";
import ProjectCard from "@/components/content/ProjectCard";
import ClosingSection from "@/components/content/ClosingSection";
import Button from "@/components/foundation/Button";
import { getClassData, getProjects, getStudents } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Beranda",
  description:
    "Buku tahunan digital dan etalase karya mahasiswa Sistem dan Teknologi Informasi angkatan 2026.",
  path: "/",
});

/**
 * Homepage assembly (T-606). Strict narrative order per PRD §4.1:
 * Hero → Class Identity & Stats → People → Projects → Closing.
 * All data flows through src/lib/data.ts; zero placeholder/fake data is
 * rendered — sections with pending content degrade to editorial fallbacks.
 */
export default function HomePage() {
  const cls = getClassData();
  const students = getStudents();
  const projects = getProjects();
  const featuredProjects = projects.filter((p) => p.featured);
  const shownProjects =
    featuredProjects.length > 0 ? featuredProjects : projects;

  const isPlaceholder = (value?: string): boolean =>
    !value || value.startsWith("[");

  return (
    <>
      <HeroSection
        heroPhoto={undefined /* T-302 blocked: hero photo submission pending */}
        heroSubheadline={undefined /* [CONTENT NEEDED] */}
        ctaLabel={undefined /* [CONTENT NEEDED] */}
      />

      <ClassIdentity />

      <Section surface="warm-parchment" id="angkatan">
        <Container>
          <SectionHeading
            kicker="People"
            headline="Angkatan"
            subhead="Wajah-wajah di balik STI 2026."
          />
          <StudentGrid students={students} />
          {students.length > 0 ? (
            <div className="home__more" data-reveal>
              <Button href="/students" variant="ghost">
                Lihat seluruh angkatan →
              </Button>
            </div>
          ) : null}
        </Container>
      </Section>

      <Section surface="paper-white">
        <Container>
          <SectionHeading
            kicker="Work"
            headline="Karya Unggulan"
            subhead="Proyek yang merepresentasikan kemampuan teknis angkatan."
          />
          {shownProjects.length === 0 ? (
            <p className="empty-state t-body" role="status">
              Etalase karya sedang dikurasi bersama mahasiswa — deskripsi,
              tim, dan visual akan diterbitkan setelah verifikasi.
            </p>
          ) : (
            <div className="project-grid">
              {shownProjects.slice(0, 6).map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  featured={project.featured}
                />
              ))}
            </div>
          )}
          {projects.length > 0 ? (
            <div className="home__more" data-reveal>
              <Button href="/projects" variant="ghost">
                Jelajahi semua karya →
              </Button>
            </div>
          ) : null}
        </Container>
      </Section>

      <ClosingSection />
    </>
  );
}
