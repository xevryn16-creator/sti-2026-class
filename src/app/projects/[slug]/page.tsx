import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/foundation/Container";
import Section from "@/components/foundation/Section";
import SectionHeading from "@/components/foundation/SectionHeading";
import Badge from "@/components/foundation/Badge";
import GradientFrame from "@/components/foundation/GradientFrame";
import SafeImage from "@/components/foundation/SafeImage";
import { getProjectBySlug, getProjects, getProjectTeam } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return getProjects().map((p) => ({ slug: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: project.description.slice(0, 160),
    path: `/projects/${project.id}`,
    ogImage: project.coverImage || undefined,
  });
}

/**
 * Project case study (T-503, SSG): full description, tech stack, team roster
 * linking back to student profiles, and secured external links (QA F-PRJ-04).
 */
export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const team = getProjectTeam(project);
  const hasCover = project.coverImage.length > 0;

  return (
    <>
      <Section surface="warm-parchment">
        <Container className="project-detail">
          {project.category || project.year ? (
            <div className="project-detail__meta" data-reveal>
              {project.category ? <Badge variant="spotlight">{project.category}</Badge> : null}
              {project.course ? <Badge>{project.course}</Badge> : null}
              {project.year ? (
                <span className="event-card__date">{project.year}</span>
              ) : null}
            </div>
          ) : null}
          <h1 className="t-heading project-detail__title" data-reveal>
            {project.title}
          </h1>
          <p className="t-body project-detail__description" data-reveal>
            {project.description}
          </p>
          {project.link ? (
            <div className="project-detail__links">
              <a
                className="btn-pill-filled"
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buka Proyek ↗
              </a>
            </div>
          ) : null}
          <div className="project-detail__cover" data-reveal>
            {hasCover ? (
              project.featured ? (
                <GradientFrame ariaLabel={`Proyek unggulan: ${project.title}`}>
                  <SafeImage
                    src={project.coverImage}
                    alt={`Tampilan proyek ${project.title}`}
                    width={1280}
                    height={720}
                    priority
                    sizes="(max-width: 767px) 100vw, 1080px"
                  />
                </GradientFrame>
              ) : (
                <SafeImage
                  src={project.coverImage}
                  alt={`Tampilan proyek ${project.title}`}
                  width={1280}
                  height={720}
                  priority
                  sizes="(max-width: 767px) 100vw, 1080px"
                />
              )
            ) : (
              <div className="project-card__media--typographic project-detail__cover-fallback">
                <p>{project.title}</p>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {project.gallery && project.gallery.length > 0 ? (
        <Section surface="paper-white">
          <Container>
            <SectionHeading kicker="Galeri" headline="Tangkapan Layar" />
            <div className="project-detail__gallery">
              {project.gallery.map((src, i) => (
                <SafeImage
                  key={`${src}-${i}`}
                  src={src}
                  alt={`Galeri ${project.title} — gambar ${i + 1}`}
                  width={1200}
                  height={800}
                  sizes="(max-width: 767px) 100vw, 560px"
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section surface="paper-white">
        <Container>
          <SectionHeading kicker="Tim" headline="Orang di Balik Proyek" />
          <ul className="project-detail__team">
            {team.map(({ student, role }) => (
              <li key={student.id} className="project-detail__member" data-reveal>
                <Link href={`/students/${student.id}`} className="project-detail__member-link">
                  <span className="t-subheading">{student.name}</span>
                  {role ? <span className="t-caption project-detail__member-role">{role}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "var(--spacing-36)" }}>
            <Link href="/projects" className="btn-pill-ghost">
              ← Kembali ke Karya
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
