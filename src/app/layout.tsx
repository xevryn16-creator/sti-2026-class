import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ScrollReveal from "@/components/experience/ScrollReveal";
import { SITE_FULL_NAME, SITE_NAME } from "@/lib/constants";
import "@/styles/globals.css";
import "@/components/foundation/foundation.css";
import "@/components/layout/layout.css";
import "@/components/layout/hero.css";
import "@/components/content/content.css";
import "@/components/content/class-identity.css";
import "@/components/experience/lightbox.css";
import "@/components/content/student-profile.css";
import "@/components/content/project-detail.css";
import "@/components/content/home.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-next",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://sti-2026-class.vercel.app",
  ),
  title: {
    default: SITE_FULL_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Buku tahunan digital dan etalase karya mahasiswa Sistem dan Teknologi Informasi angkatan 2026.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    siteName: SITE_FULL_NAME,
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint: enables scroll-reveal hiding ONLY when scripting
 * is active and the user allows full motion. Everyone else (no-JS, reduced
 * motion) always sees content immediately.
 */
const REVEAL_BOOTSTRAP = `(function(){try{var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(!r){document.documentElement.dataset.revealReady="true";}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOTSTRAP }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Lewati ke konten utama
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <ScrollReveal />
      </body>
    </html>
  );
}
