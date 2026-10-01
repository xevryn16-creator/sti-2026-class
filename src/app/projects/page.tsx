import type { Metadata } from "next";
import Container from "@/components/foundation/Container";
import Section from "@/components/foundation/Section";
import SectionHeading from "@/components/foundation/SectionHeading";
import ProjectDirectory from "@/components/content/ProjectDirectory";
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
        <ProjectDirectory projects={projects} />
      </Container>
    </Section>
  );
}
