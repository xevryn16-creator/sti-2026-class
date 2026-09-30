"use client";

import SafeImage from "@/components/foundation/SafeImage";
import type { MemoryPhoto } from "@/types";

interface MemoryCardProps {
  photo: MemoryPhoto;
  /** index within the enclosing gallery/story */
  index: number;
  onOpen: (index: number) => void;
  activity?: string;
  date?: string;
}

/**
 * Photo card (T-506A, docs/DESIGN.md §4.5). Renders as a real <button> so
 * Enter/Space opens the lightbox natively (QA F-GAL-01).
 */
export default function MemoryCard({ photo, index, onOpen, activity, date }: MemoryCardProps) {
  return (
    <button type="button" className="memory-card" data-reveal onClick={() => onOpen(index)}>
      <span className="memory-card__media">
        {activity ? <span className="badge badge--default memory-card__activity">{activity}</span> : null}
        <SafeImage
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 380px"
        />
      </span>
      {photo.caption || date ? (
        <span className="memory-card__caption">
          {photo.caption}
          {date ? <span className="memory-card__date"> — {date}</span> : null}
        </span>
      ) : null}
    </button>
  );
}
