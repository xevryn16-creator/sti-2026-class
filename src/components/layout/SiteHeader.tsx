import Link from "next/link";
import NavLinks from "@/components/layout/NavLinks";
import NavDrawer from "@/components/layout/NavDrawer";

/**
 * Sticky 72px header (docs/DESIGN.md §4.7): wordmark left, links center,
 * (CTA reserved right), hamburger below 1024px.
 */
export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__wordmark" aria-label="STI 2026 — Beranda">
          STI 2026
        </Link>
        <NavLinks className="site-header__links" />
        <NavDrawer />
      </div>
    </header>
  );
}
