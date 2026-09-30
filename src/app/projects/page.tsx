import type { Metadata } from "next";
import Container from "@/components/foundation/Container";
import Section from "@/components/foundation/Section";
import SectionHeading from "@/components/foundation/SectionHeading";
import ProjectCard from "@/components/content/ProjectCard";
import { getProjects } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Karya",
  description:
    "Koleksi proyek perangkat lunak, sistem informasi, dan riset mahasiswa STI 2026.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <Section surface="paper-white">
      <Container>
        <SectionHeading
          as="h1"
          kicker="Work"
          headline="Karya"
          subhead="Proyek akademik, kompetisi, dan independen yang dibangun angkatan."
        />
        {projects.length === 0 ? (
          <p className="empty-state t-body" role="status">
            Etalase proyek sedang dikurasi — deskripsi, tim, dan visual akan
            diterbitkan setelah verifikasi.
          </p>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={project.featured}
              />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
