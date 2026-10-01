import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/foundation/Container";
import Section from "@/components/foundation/Section";
import SectionHeading from "@/components/foundation/SectionHeading";
import Badge from "@/components/foundation/Badge";
import SafeImage from "@/components/foundation/SafeImage";
import ProjectCard from "@/components/content/ProjectCard";
import { getStudentBySlug, getStudents } from "@/lib/data";
import { getRoleLabelsForStudent } from "@/lib/data";
import { getProjectsByStudent } from "@/lib/data";
import { getAchievementsByStudent } from "@/lib/data";
import { SOCIAL_PLATFORM_LABELS } from "@/lib/constants";
import { initialsOf } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import type { StudentEntity } from "@/types";

interface Params {
  params: Promise<{ slug: string }>;
}

/** Pre-render every consented student profile at build time (QA F-STU-04). */
export function generateStaticParams(): { slug: string }[] {
  return getStudents().map((s) => ({ slug: s.id }));
}

/*
 * `dynamicParams` intentionally stays at its default (`true`). With `false`,
 * any student added after the build (i.e. through the CMS) rendered a card in
 * the directory that linked to a hard 404 until the next rebuild. Unknown or
 * unconsented slugs still 404 via `notFound()` below, so the consent firewall
 * is unchanged (docs/QA.md F-STU-02/F-STU-05).
 */

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const student = getStudentBySlug(slug);
  if (!student) return {};
  return buildMetadata({
    title: student.name,
    description: student.bio
      ? `Profil profesional, karya, dan perjalanan ${student.name} di STI angkatan 2026. ${student.bio}`.slice(0, 160)
      : `Profil profesional, karya, dan perjalanan ${student.name} di STI angkatan 2026.`,
    path: `/students/${student.id}`,
    ogImage: student.photo || undefined,
  });
}

function SocialLinks({ student }: { student: StudentEntity }) {
  if (!student.socialLinks || student.socialLinks.length === 0) return null;
  return (
    <ul className="student-profile__social">
      {student.socialLinks.map((link) => (
        <li key={`${link.platform}-${link.url}`}>
          <a
            className="btn-pill-ghost"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label ?? SOCIAL_PLATFORM_LABELS[link.platform] ?? link.platform}
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Individual student profile (T-404, SSG). Only consented slugs resolve;
 * unknown or unconsented slugs return the editorial 404 (QA F-STU-02/05).
 */
export default async function StudentProfilePage({ params }: Params) {
  const { slug } = await params;
  const student = getStudentBySlug(slug);
  if (!student) notFound();

  const roles = getRoleLabelsForStudent(student);
  const projects = getProjectsByStudent(student.id);
  const achievements = getAchievementsByStudent(student.id);
  const hasPhoto = student.photo.length > 0;

  return (
    <>
      <Section surface="warm-parchment">
        <Container className="student-profile">
          <div className="student-profile__media" data-reveal>
            {hasPhoto ? (
              <SafeImage
                src={student.photo}
                alt={`Potret ${student.name}`}
                width={800}
                height={1066}
                priority
                sizes="(max-width: 767px) 100vw, 420px"
              />
            ) : (
              <div className="monogram student-profile__monogram" aria-hidden="true">
                <span className="monogram__initials">{initialsOf(student.name)}</span>
              </div>
            )}
          </div>
          <div className="student-profile__info" data-reveal>
            <p className="section-kicker">Angkatan 2026</p>
            <h1 className="t-heading">{student.name}</h1>
            {student.nickname ? (
              <p className="t-body student-profile__nickname">“{student.nickname}”</p>
            ) : null}
            {roles.length > 0 ? (
              <ul className="student-profile__roles" aria-label="Peran">
                {roles.map((role) => (
                  <li key={role}>
                    <Badge variant="spotlight">{role}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
            {student.bio ? <p className="t-body">{student.bio}</p> : null}
            {student.quote ? (
              <blockquote className="student-profile__quote t-subheading">
                “{student.quote}”
              </blockquote>
            ) : null}
            {student.interests && student.interests.length > 0 ? (
              <ul className="student-profile__interests" aria-label="Minat">
                {student.interests.map((interest) => (
                  <li key={interest}>
                    <Badge>{interest}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
            <SocialLinks student={student} />
          </div>
        </Container>
      </Section>

      {projects.length > 0 ? (
        <Section surface="paper-white">
          <Container>
            <SectionHeading kicker="Karya" headline="Proyek Terlibat" />
            <div className="project-grid">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} featured={project.featured} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {achievements.length > 0 ? (
        <Section surface="warm-parchment">
          <Container>
            <SectionHeading kicker="Prestasi" headline="Penghargaan Terverifikasi" />
            <ul className="student-profile__achievements">
              {achievements.map((achievement) => (
                <li key={achievement.id} className="t-body">
                  {achievement.title}
                  {achievement.year ? ` (${achievement.year})` : ""}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section surface="paper-white">
        <Container>
          <Link href="/students" className="btn-pill-ghost">
            ← Kembali ke Angkatan
          </Link>
        </Container>
      </Section>
    </>
  );
}
