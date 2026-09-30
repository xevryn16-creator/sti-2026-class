import type { Metadata } from "next";
import Container from "@/components/foundation/Container";
import Section from "@/components/foundation/Section";
import SectionHeading from "@/components/foundation/SectionHeading";
import TimelineView from "@/components/content/TimelineView";
import { getTimeline } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Perjalanan",
  description:
    "Rekam jejak kronologis perjalanan mahasiswa STI 2026 dari awal masuk hingga wisuda.",
  path: "/timeline",
});

export default function TimelinePage() {
  const entries = getTimeline();

  return (
    <Section surface="paper-white">
      <Container>
        <SectionHeading
          as="h1"
          kicker="2022 — 2026"
          headline="Perjalanan Angkatan"
          subhead="Jejak empat tahun, dari langkah pertama di kampus hingga hari kelulusan."
        />
        <TimelineView entries={entries} />
      </Container>
    </Section>
  );
}
