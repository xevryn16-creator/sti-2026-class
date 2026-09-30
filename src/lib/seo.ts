import type { Metadata } from "next";
import { SITE_FULL_NAME, SITE_NAME, SITE_URL } from "@/lib/constants";

interface PageMetaInput {
  title: string;
  description: string;
  /** Route path beginning with "/" (used for canonical + og:url). */
  path: string;
  /** Absolute or root-relative OG image path (1200×630). */
  ogImage?: string;
}

/**
 * Build route metadata per docs/CONTENT.md §5 templates. The root layout
 * template (`%s | STI 2026`) composes the final title, so `title` is passed
 * through as the page segment only. QA §8: every page has a unique title.
 */
export function buildMetadata({ title, description, path, ogImage }: PageMetaInput): Metadata {
  const fullTitle = title;
  const imageUrl = ogImage ? new URL(ogImage, SITE_URL).toString() : undefined;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: new URL(path, SITE_URL).toString(),
      siteName: SITE_FULL_NAME,
      locale: "id_ID",
      type: "website",
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}
