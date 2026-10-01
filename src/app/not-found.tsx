import type { Metadata } from "next";
import Container from "@/components/foundation/Container";
import Button from "@/components/foundation/Button";
import Typography from "@/components/foundation/Typography";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Halaman Tidak Ditemukan",
    description:
      "Halaman yang Anda tuju tidak ditemukan atau telah diarsipkan ke tempat lain.",
    path: "/404",
  }),
  // An error page must never advertise a canonical URL or be indexed.
  alternates: undefined,
  robots: { index: false, follow: true },
};

/**
 * Editorial 404 (T-205, docs/ARCHITECTURE.md §8.2): Warm Parchment canvas,
 * display "404", dignified copy, single return CTA. Deliberately not a
 * generic framework error screen.
 */
export default function NotFound() {
  return (
    <div className="not-found section section--warm-parchment">
      <Container className="not-found__inner">
        <Typography variant="display" as="p" className="not-found__code">
          404
        </Typography>
        <Typography variant="subheading" as="h1">
          Halaman Tidak Ditemukan
        </Typography>
        <Typography variant="body" color="graphite" className="not-found__copy">
          Halaman yang Anda tuju tidak ditemukan atau telah diarsipkan ke tempat lain.
        </Typography>
        <Button href="/" className="not-found__cta">
          Kembali ke Beranda
        </Button>
      </Container>
    </div>
  );
}
