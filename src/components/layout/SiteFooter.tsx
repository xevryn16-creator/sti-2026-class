import Link from "next/link";
import Container from "@/components/foundation/Container";
import Typography from "@/components/foundation/Typography";
import { NAV_LINKS, SITE_FULL_NAME } from "@/lib/constants";
import { getClassData } from "@/lib/data";

/**
 * Editorial footer (T-204, docs/CONTENT.md §4.2): program attribution,
 * navigation, copyright. Warm Parchment surface.
 */
export default function SiteFooter() {
  const cls = getClassData();

  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <p className="t-subheading">{SITE_FULL_NAME}</p>
            <Typography variant="body" color="graphite" className="site-footer__meta">
              {[cls.university, cls.faculty]
                .filter((v) => v && !v.startsWith("["))
                .join(" — ") || "Buku tahunan digital angkatan Sistem dan Teknologi Informasi 2026."}
            </Typography>
          </div>
          <nav aria-label="Navigasi footer" className="site-footer__nav">
            <ul className="site-footer__links">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/admin" className="nav-link site-footer__dev-link">
                  Portal Redaksi (Dev Login)
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="site-footer__base">
          <Typography variant="caption" color="graphite">
            © 2026 STI 2026. Seluruh hak cipta dilindungi undang-undang.
          </Typography>
          <Typography variant="caption" color="ash">
            Dirancang dan dibangun dengan penuh dedikasi oleh Tim Digital STI 2026.
          </Typography>
        </div>
      </Container>
    </footer>
  );
}
