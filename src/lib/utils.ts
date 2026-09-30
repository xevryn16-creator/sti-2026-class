/** Shared small helpers. Keep dependency-free and framework-agnostic. */

/** Join truthy class names. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Uppercase initials for monogram fallbacks: "Budi Santoso" → "BS". */
export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

/**
 * Format an ISO date ("YYYY-MM-DD" or "YYYY-MM") in long Indonesian form.
 * Unknown shapes render verbatim. Never fabricates a date.
 */
export function formatDateId(iso: string): string {
  const parts = iso.split("-");
  const year = parts.at(-1);
  const monthIndex = parts.length >= 2 ? Number(parts[1]) - 1 : NaN;
  if (!year || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return iso;
  }
  const month = MONTHS_ID[monthIndex];
  if (parts.length === 3) {
    const day = parts[0] ? parts[0] : undefined;
    return day ? `${day} ${month} ${year}` : `${month} ${year}`;
  }
  return `${month} ${year}`;
}
