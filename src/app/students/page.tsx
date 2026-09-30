import type { Metadata } from "next";
import Container from "@/components/foundation/Container";
import Section from "@/components/foundation/Section";
import SectionHeading from "@/components/foundation/SectionHeading";
import StudentGrid from "@/components/content/StudentGrid";
import { getStudents } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Angkatan",
  description:
    "Kenali profil, minat, karya, dan jejak langkah seluruh mahasiswa STI angkatan 2026.",
  path: "/students",
});

export default function StudentsPage() {
  const students = getStudents();

  return (
    <Section surface="warm-parchment">
      <Container>
        <SectionHeading
          as="h1"
          kicker="People"
          headline="Angkatan"
          subhead="Individu-individu di balik STI 2026 — minat, peran, dan karya mereka."
        />
        <StudentGrid students={students} />
      </Container>
    </Section>
  );
}
