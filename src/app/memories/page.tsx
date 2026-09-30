import type { Metadata } from "next";
import Container from "@/components/foundation/Container";
import Section from "@/components/foundation/Section";
import SectionHeading from "@/components/foundation/SectionHeading";
import Badge from "@/components/foundation/Badge";
import GalleryGrid from "@/components/content/GalleryGrid";
import { getCampusPhotos, getMemories } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Kenangan",
  description:
    "Dokumentasi visual dan momen berharga kehidupan perkuliahan STI 2026.",
  path: "/memories",
});

/**
 * Campus life archive (T-506A/B): curated multi-photo stories, then the
 * candid campus gallery. All viewing happens through the accessible
 * GalleryLightbox.
 */
export default function MemoriesPage() {
  const memories = getMemories();
  const campusPhotos = getCampusPhotos();

  return (
    <>
      <Section surface="paper-white">
        <Container>
          <SectionHeading
            as="h1"
            kicker="Moments"
            headline="Kenangan"
            subhead="Cerita visual dari perjalanan kami — praktikum, perjalanan, dan kebersamaan."
          />
          {memories.length === 0 ? (
            <p className="empty-state t-body" role="status">
              Cerita foto sedang dikurasi dari arsip angkatan.
            </p>
          ) : (
            memories.map((memory) => (
              <article key={memory.id} className="memory-story">
                <header className="memory-story__header" data-reveal>
                  {memory.category || memory.period ? (
                    <div className="memory-story__meta">
                      {memory.category ? <Badge>{memory.category}</Badge> : null}
                      {memory.period ? <span>{memory.period}</span> : null}
                    </div>
                  ) : null}
                  <h2 className="t-heading-sm">{memory.title}</h2>
                  {memory.description ? (
                    <p className="t-body">{memory.description}</p>
                  ) : null}
                </header>
                <GalleryGrid
                  items={memory.photos.map((photo) => ({ photo }))}
                />
              </article>
            ))
          )}
        </Container>
      </Section>

      <Section surface="warm-parchment">
        <Container>
          <SectionHeading
            kicker="Campus Life"
            headline="Keseharian Kampus"
            subhead="Momen candid yang direkam sepanjang perkuliahan."
          />
          {campusPhotos.length === 0 ? (
            <p className="empty-state t-body" role="status">
              Foto kampus sedang dalam proses digitalisasi arsip.
            </p>
          ) : (
            <GalleryGrid
              items={campusPhotos.map((photo) => ({
                photo: { src: photo.src, alt: photo.alt, caption: photo.caption },
                activity: photo.activity,
                date: photo.date,
              }))}
            />
          )}
        </Container>
      </Section>
    </>
  );
}
