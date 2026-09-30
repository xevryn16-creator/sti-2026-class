import Badge from "@/components/foundation/Badge";
import SafeImage from "@/components/foundation/SafeImage";
import { EVENT_CATEGORY_LABELS } from "@/lib/constants";
import { formatDateId } from "@/lib/utils";
import type { EventEntity } from "@/types";

interface EventListProps {
  events: EventEntity[];
}

/**
 * Chronological event archive (T-602). Dates formatted in Indonesian;
 * typographic fallback when no poster exists (FB-05).
 */
export default function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <p className="empty-state t-body" role="status">
        Arsip acara sedang dalam proses penyusunan oleh komite arsip angkatan.
      </p>
    );
  }

  return (
    <div className="event-list">
      {events.map((event) => {
        const categoryLabel = event.category
          ? EVENT_CATEGORY_LABELS[event.category] ?? event.category
          : null;
        return (
          <article key={event.id} className="event-card" data-reveal>
            {event.poster ? (
              <div className="event-card__media">
                <SafeImage
                  src={event.poster}
                  alt={`Dokumentasi ${event.title}`}
                  width={1000}
                  height={750}
                  sizes="(max-width: 767px) 100vw, 720px"
                />
              </div>
            ) : null}
            <div className="event-card__head">
              <p className="event-card__date">{formatDateId(event.date)}</p>
              {categoryLabel ? <Badge>{categoryLabel}</Badge> : null}
            </div>
            <h3 className="t-subheading">{event.title}</h3>
            <p className="t-body event-card__description">{event.description}</p>
            {event.location ? (
              <p className="event-card__location">{event.location}</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
