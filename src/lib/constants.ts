import type { SocialPlatform } from "@/types";

export const SITE_NAME = "STI 2026";
export const SITE_FULL_NAME = "STI 2026 — Sistem dan Teknologi Informasi";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sti-2026-class.vercel.app";

export interface NavLink {
  href: string;
  label: string;
}

/** Navigation labels per docs/CONTENT.md §4.1 (Bahasa Indonesia). */
export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Beranda" },
  { href: "/students", label: "Angkatan" },
  { href: "/projects", label: "Karya" },
  { href: "/memories", label: "Kenangan" },
  { href: "/events", label: "Acara" },
  { href: "/timeline", label: "Perjalanan" },
];

/** Permitted public professional platforms (docs/CONTENT.md §2.2). */
export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  behance: "Behance",
  portfolio: "Portofolio",
  instagram: "Instagram",
};

export const EVENT_CATEGORY_LABELS: Record<string, string> = {
  academic: "Akademik",
  social: "Sosial",
  competition: "Kompetisi",
  ceremony: "Seremoni",
  other: "Lainnya",
};

export const TIMELINE_CATEGORY_LABELS: Record<string, string> = {
  matriculation: "Awal Kuliah",
  academic: "Akademik",
  social: "Sosial",
  milestone: "Milestone",
  graduation: "Kelulusan",
};
