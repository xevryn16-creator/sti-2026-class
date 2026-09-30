import SafeImage from "@/components/foundation/SafeImage";
import { TIMELINE_CATEGORY_LABELS } from "@/lib/constants";
import { formatDateId } from "@/lib/utils";
import type { TimelineEntryEntity } from "@/types";

interface TimelineViewProps {
  entries: TimelineEntryEntity[];
}

/**
 * Chronological journey track (T-604, docs/DESIGN.md §4.6): alternating
 * cards on desktop ≥ 768px, single left-aligned column below. Entries are
 * revealed progressively (R-03).
 */
export default function TimelineView({ entries }: TimelineViewProps) {
  if (entries.length === 0) {
    return (
      <p className="empty-state t-body" role="status">
        Perjalanan angkatan sedang direkonstruksi dari arsip 2022–2026.
      </p>
    );
  }

  return (
    <ol className="timeline">
      {entries.map((entry) => {
        const categoryLabel = entry.category
          ? TIMELINE_CATEGORY_LABELS[entry.category] ?? entry.category
          : null;
        return (
          <li key={entry.id} className="timeline-entry" data-reveal>
            <span className="timeline-entry__node" aria-hidden="true" />
            <div className="timeline-entry__card">
              <p className="timeline-entry__date">
                {formatDateId(entry.date)}
                {categoryLabel ? ` · ${categoryLabel}` : ""}
              </p>
              <h3 className="t-subheading timeline-entry__title">{entry.milestone}</h3>
              {entry.description ? (
                <p className="t-body timeline-entry__description">{entry.description}</p>
              ) : null}
            </div>
            {entry.image ? (
              <div className="timeline-entry__media">
                <SafeImage
                  src={entry.image}
                  alt={`Dokumentasi: ${entry.milestone}`}
                  width={900}
                  height={600}
                  sizes="(max-width: 767px) 100vw, 430px"
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
