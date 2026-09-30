import Container from "@/components/foundation/Container";
import Section from "@/components/foundation/Section";
import Typography from "@/components/foundation/Typography";
import SafeImage from "@/components/foundation/SafeImage";
import Button from "@/components/foundation/Button";
import { getClassData } from "@/lib/data";

const isPlaceholder = (value?: string): boolean =>
  !value || value.startsWith("[");

/**
 * Valedictory closing (T-605, docs/CONTENT.md §3 Section 10). Typography-
 * first on Ink Black; renders whatever verified content exists and omits
 * placeholder blocks entirely.
 */
export default function ClosingSection() {
  const cls = getClassData();
  const paragraphs = cls.valedictoryBody.filter(
    (p) => p && !isPlaceholder(p),
  );

  return (
    <Section surface="ink-black" className="closing" id="penutup">
      <Container>
        {!isPlaceholder(cls.valedictoryTitle) ? (
          <h2 className="t-heading-lg" data-reveal>
            {cls.valedictoryTitle}
          </h2>
        ) : null}
        <div className="closing__body" data-reveal>
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, i) => (
              <Typography
                key={i}
                variant="body"
                className="closing__paragraph"
              >
                {paragraph}
              </Typography>
            ))
          ) : (
            <Typography variant="body" className="closing__paragraph">
              Naskah perpisahan angkatan sedang dalam penyusunan bersama oleh
              perwakilan kelas dan akan diterbitkan di halaman ini.
            </Typography>
          )}
          <Typography variant="subheading" className="closing__signoff">
            — {cls.signOff}
          </Typography>
        </div>
        {cls.closingPhoto && !isPlaceholder(cls.closingPhoto) ? (
          <div className="closing__media" data-reveal>
            <SafeImage
              src={cls.closingPhoto}
              alt="Foto penutup angkatan STI 2026"
              width={1920}
              height={800}
              sizes="(max-width: 767px) 100vw, 1080px"
            />
          </div>
        ) : null}
        <div style={{ marginTop: "var(--spacing-36)" }}>
          <Button href="/students">Kenalan dengan Angkatan</Button>
        </div>
      </Container>
    </Section>
  );
}
