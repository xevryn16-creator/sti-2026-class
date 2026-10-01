/**
 * Banned personal data (docs/CONTENT.md §2.1).
 *
 * Single source of truth: the public data layer (`src/lib/data.ts`) and the
 * CMS write path (`src/lib/cms/store.ts`) must agree on exactly what is
 * prohibited, otherwise a record can slip in through the editor and only break
 * the public build — or worse, never be caught at all.
 */
export const BANNED_PII_KEYS: readonly string[] = [
  "phone",
  "address",
  "nim",
  "gpa",
  "email",
  "whatsapp",
  "telegram",
  "discord",
  "transcript",
  "grade",
];

/**
 * Deep scan for prohibited keys, including nested objects and array items.
 * Returns the offending path (e.g. `roles[0].email`) or `null` when clean.
 */
export function findBannedPiiKey(value: unknown, path = ""): string | null {
  if (value === null || typeof value !== "object") return null;

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      const hit = findBannedPiiKey(value[i], `${path}[${i}]`);
      if (hit) return hit;
    }
    return null;
  }

  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    const childPath = path ? `${path}.${key}` : key;
    if (BANNED_PII_KEYS.includes(key.toLowerCase())) return childPath;
    const hit = findBannedPiiKey(nested, childPath);
    if (hit) return hit;
  }

  return null;
}
