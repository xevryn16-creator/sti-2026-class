import type { Metadata } from "next";
import { SITE_FULL_NAME, SITE_NAME, SITE_URL } from "@/lib/constants";

interface PageMetaInput {
  title: string;
  description: string;
  /** Route path beginning with "/" (used for canonical + og:url). */
  path: string;
  /** Absolute or root-relative OG image path (1200×630). */
  ogImage?: string;
  /**
   * For the root segment only (`src/app/page.tsx`). Next.js does not apply a
   * layout's `title.template` to a page in the SAME segment as that layout, so
   * the homepage must compose the brand suffix itself.
   */
  absoluteTitle?: boolean;
}

/** Default social card: the generated `src/app/opengraph-image.tsx` (1200×630). */
const DEFAULT_OG_IMAGE = "/opengraph-image";

/**
 * Build route metadata per docs/CONTENT.md §5 templates. The root layout
 * template (`%s | STI 2026`) composes the final title, so `title` is passed
 * through as the page segment only. QA §8: every page has a unique title,
 * canonical URL, absolute og:url, and a 1200×630 og:image.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const fullTitle = title;
  const resolvedTitle: Metadata["title"] = absoluteTitle
    ? { absolute: `${title} | ${SITE_NAME}` }
    : title;
  const ogTitle = absoluteTitle ? `${title} | ${SITE_NAME}` : title;
  const imageUrl = new URL(ogImage ?? DEFAULT_OG_IMAGE, SITE_URL).toString();

  return {
    title: resolvedTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: new URL(path, SITE_URL).toString(),
      siteName: SITE_FULL_NAME,
      locale: "id_ID",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [imageUrl],
    },
  };
}
