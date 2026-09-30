import Container from "@/components/foundation/Container";
import Section from "@/components/foundation/Section";
import SectionHeading from "@/components/foundation/SectionHeading";
import { getClassData } from "@/lib/data";

const isPlaceholder = (value?: string): boolean =>
  !value || value.startsWith("[");

/**
 * Class identity & macro stats (docs/CONTENT.md §3 Section 2). Renders the
 * cohort statement, optional motto, and ONLY verified statistics — if stats
 * are absent or unverified the row is omitted entirely (never synthetic).
 */
export default function ClassIdentity() {
  const cls = getClassData();
  const stats = (cls.stats ?? []).filter(
    (stat) => !isPlaceholder(stat.value) && !isPlaceholder(stat.label),
  );

  return (
    <Section surface="paper-white" id="identitas">
      <Container>
        <SectionHeading
          kicker="Identitas Angkatan"
          headline={`${cls.programName}`}
          as="h2"
        />
        <div className="class-identity__statement" data-reveal>
          {isPlaceholder(cls.statement) ? (
            <p className="t-body class-identity__text content-needed">
              [CONTENT NEEDED] — Pernyataan identitas angkatan sedang disusun
              oleh perwakilan kelas.
            </p>
          ) : (
            <p className="t-body class-identity__text">{cls.statement}</p>
          )}
          {cls.motto && !isPlaceholder(cls.motto) ? (
            <p className="t-heading-sm class-identity__motto">“{cls.motto}”</p>
          ) : null}
        </div>
        {stats.length > 0 ? (
          <dl className="class-identity__stats" data-reveal>
            {stats.map((stat) => (
              <div key={stat.label} className="class-identity__stat">
                <dt className="t-caption class-identity__stat-label">{stat.label}</dt>
                <dd className="t-heading class-identity__stat-value">{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Container>
    </Section>
  );
}
