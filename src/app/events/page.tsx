import type { Metadata } from "next";
import Container from "@/components/foundation/Container";
import Section from "@/components/foundation/Section";
import SectionHeading from "@/components/foundation/SectionHeading";
import EventList from "@/components/content/EventList";
import { getEvents } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Acara",
  description:
    "Arsip kegiatan akademis, sosial, dan kompetisi yang diikuti STI 2026.",
  path: "/events",
});

export default function EventsPage() {
  const events = getEvents();

  return (
    <Section surface="warm-parchment">
      <Container>
        <SectionHeading
          as="h1"
          kicker="Archive"
          headline="Acara & Dokumentasi"
          subhead="Kegiatan yang menemani perjalanan angkatan, dari orientasi hingga wisuda."
        />
        <EventList events={events} />
      </Container>
    </Section>
  );
}
