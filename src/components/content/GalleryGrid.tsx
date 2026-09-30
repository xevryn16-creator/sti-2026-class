"use client";

import { useCallback, useState } from "react";
import GalleryLightbox from "@/components/experience/GalleryLightbox";
import MemoryCard from "@/components/content/MemoryCard";
import type { MemoryPhoto } from "@/types";

export interface GalleryItem {
  photo: MemoryPhoto;
  /** Optional activity tag rendered on the card. */
  activity?: string;
  /** Optional date/period label rendered on the card. */
  date?: string;
}

interface GalleryGridProps {
  /** Plain-data items — resolved by the server component that renders this grid. */
  items: GalleryItem[];
}

/**
 * Gallery coordination (T-506A): renders the responsive card grid and owns
 * lightbox state. Receives plain data only (RSC boundary: no function props).
 * Focus restoration to the triggering thumbnail is handled inside the
 * lightbox (QA F-GAL-06).
 */
export default function GalleryGrid({ items }: GalleryGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClose = useCallback(() => setOpenIndex(null), []);

  return (
    <>
      <div className="gallery-grid">
        {items.map((item, index) => (
          <div key={`${item.photo.src}-${index}`}>
            <MemoryCard
              photo={item.photo}
              index={index}
              onOpen={setOpenIndex}
              activity={item.activity}
              date={item.date}
            />
          </div>
        ))}
      </div>
      <GalleryLightbox
        photos={items.map((item) => item.photo)}
        startIndex={openIndex}
        onClose={handleClose}
      />
    </>
  );
}
