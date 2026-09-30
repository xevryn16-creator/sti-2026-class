import Link from "next/link";
import Badge from "@/components/foundation/Badge";
import SafeImage from "@/components/foundation/SafeImage";
import { initialsOf } from "@/lib/utils";
import type { StudentEntity } from "@/types";

interface StudentCardProps {
  student: StudentEntity;
}

/**
 * Directory card (T-402, docs/DESIGN.md §4.3). Portrait 3:4 with monogram
 * fallback when no photo is available (FB-01). Whole card is one link.
 */
export default function StudentCard({ student }: StudentCardProps) {
  const hasPhoto = student.photo.length > 0;

  return (
    <Link
      href={`/students/${student.id}`}
      className="student-card"
      data-reveal
      aria-label={`Profil ${student.name}`}
    >
      <div className="student-card__media">
        {hasPhoto ? (
          <SafeImage
            src={student.photo}
            alt={`Potret ${student.name}`}
            width={800}
            height={1066}
            sizes="(max-width: 429px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 280px"
            className="student-card__photo"
          />
        ) : (
          <div className="monogram" aria-hidden="true">
            <span className="monogram__initials">{initialsOf(student.name)}</span>
          </div>
        )}
      </div>
      <div className="student-card__body">
        <h3 className="t-subheading student-card__name">{student.name}</h3>
        {student.nickname ? (
          <p className="t-caption student-card__nickname">{student.nickname}</p>
        ) : null}
        {student.interests && student.interests.length > 0 ? (
          <ul className="student-card__interests" aria-label="Minat">
            {student.interests.slice(0, 3).map((interest) => (
              <li key={interest}>
                <Badge>{interest}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Link>
  );
}
