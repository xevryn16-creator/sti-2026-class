import Link from "next/link";
import Badge from "@/components/foundation/Badge";
import { getStudents } from "@/lib/data";
import type { AchievementEntity } from "@/types";

interface AchievementListProps {
  achievements: AchievementEntity[];
}

/**
 * Verified achievement index (T-603). Only consent-verified records reach
 * this component (enforced in src/lib/data.ts). Recipient names link to
 * student profiles.
 */
export default function AchievementList({ achievements }: AchievementListProps) {
  if (achievements.length === 0) {
    return (
      <p className="empty-state t-body" role="status">
        Penghargaan terverifikasi akan diterbitkan setelah verifikasi oleh komite angkatan.
      </p>
    );
  }

  return (
    <div className="achievement-list">
      {achievements.map((achievement) => {
        const recipients = getStudents().filter((s) =>
          achievement.studentIds.includes(s.id),
        );
        return (
          <article key={achievement.id} className="achievement-card" data-reveal>
            <div className="achievement-card__head">
              <Badge variant="spotlight">{achievement.category}</Badge>
              {achievement.level ? <Badge>{achievement.level}</Badge> : null}
              {achievement.year ? (
                <span className="event-card__date">{achievement.year}</span>
              ) : null}
            </div>
            <h3 className="t-subheading">{achievement.title}</h3>
            {achievement.description ? (
              <p className="t-body">{achievement.description}</p>
            ) : null}
            {recipients.length > 0 ? (
              <p className="t-caption achievement-card__recipients">
                {recipients.map((r, i) => (
                  <span key={r.id}>
                    {i > 0 ? ", " : ""}
                    <Link href={`/students/${r.id}`}>{r.name}</Link>
                  </span>
                ))}
              </p>
            ) : null}
            {achievement.proofUrl ? (
              <a
                className="btn-pill-ghost"
                href={achievement.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Lihat bukti
              </a>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
