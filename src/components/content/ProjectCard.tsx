import Link from "next/link";
import Badge from "@/components/foundation/Badge";
import GradientFrame from "@/components/foundation/GradientFrame";
import SafeImage from "@/components/foundation/SafeImage";
import { getProjectTeam } from "@/lib/data";
import type { ProjectEntity } from "@/types";

interface ProjectCardProps {
  project: ProjectEntity;
  /** Wrap the cover in the Broadcast Gradient ring (featured only). */
  featured?: boolean;
}

/**
 * Showcase card (T-502, docs/DESIGN.md §4.4). 16:9 cover with typographic
 * fallback (FB-04). Featured projects receive the GradientFrame treatment.
 */
export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const team = getProjectTeam(project);
  const hasCover = project.coverImage.length > 0;
  const cover = (
    <div className={`project-card__media${hasCover ? "" : " project-card__media--typographic"}`}>
      {hasCover ? (
        <SafeImage
          src={project.coverImage}
          alt={`Tampilan proyek ${project.title}`}
          width={1280}
          height={720}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 380px"
          className="project-card__image"
        />
      ) : (
        <p>{project.title}</p>
      )}
    </div>
  );

  return (
    <article className="project-card" data-reveal>
      {featured ? (
        <GradientFrame ariaLabel={`Proyek unggulan: ${project.title}`}>{cover}</GradientFrame>
      ) : (
        cover
      )}
      <div className="project-card__body">
        <h3 className="t-heading-sm project-card__title">
          <Link href={`/projects/${project.id}`} className="project-card__link">
            {project.title}
          </Link>
        </h3>
        {team.length > 0 ? (
          <p className="project-card__meta">
            {team.map((member) => member.student.name).join(", ")}
          </p>
        ) : null}
        {project.technology && project.technology.length > 0 ? (
          <ul className="project-card__tech" aria-label="Teknologi">
            {project.technology.slice(0, 4).map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
