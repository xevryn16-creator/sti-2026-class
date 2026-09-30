interface SectionHeadingProps {
  kicker?: string;
  headline: string;
  subhead?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  id?: string;
}

/**
 * Section heading stack per docs/DESIGN.md §4.8: uppercase kicker (optional),
 * Geist 500 headline, graphite subhead, 24px bottom gap before the grid.
 */
export default function SectionHeading({
  kicker,
  headline,
  subhead,
  align = "left",
  as = "h2",
  id,
}: SectionHeadingProps) {
  const Tag = as;
  return (
    <div
      data-reveal
      className={`section-heading-stack${align === "center" ? " section-heading-stack--center" : ""}`}
    >
      {kicker ? <p className="section-kicker">{kicker}</p> : null}
      <Tag className="t-heading-lg" id={id}>
        {headline}
      </Tag>
      {subhead ? <p className="section-subhead">{subhead}</p> : null}
    </div>
  );
}
