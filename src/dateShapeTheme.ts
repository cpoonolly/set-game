/**
 * Maps daily puzzle seeds (YYYY-MM-DD) to visual themes (shapes + colors).
 * Game rules and card encoding are unchanged — only presentation differs.
 */

export type DateThemeId = "default" | "easter";

/** @deprecated Use DateThemeId — same union, kept for any external imports. */
export type ShapeThemeId = DateThemeId;

export const DEFAULT_DATE_THEME: DateThemeId = "default";

export const DEFAULT_SHAPE_THEME: DateThemeId = "default";

/** Western (Gregorian) Easter Sunday as UTC midnight date string YYYY-MM-DD for `year`. */
export function westernEasterDateStringUtc(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  const utc = new Date(Date.UTC(year, month - 1, day));
  return utc.toISOString().slice(0, 10);
}

function parseSeedDate(seed: string): { year: number; month: number; day: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(seed.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

type ThemeRule = {
  id: DateThemeId;
  /** Return true if this seed should use `id`. First matching rule wins. */
  match: (seed: string, parsed: { year: number; month: number; day: number }) => boolean;
};

const rules: ThemeRule[] = [
  {
    id: "easter",
    match: (seed, { year }) => {
      const easter = westernEasterDateStringUtc(year);
      return seed === easter;
    },
  },
  // Add more rules here, e.g. fixed MM-DD or ranges:
  // { id: "halloween", match: (_, { month, day }) => month === 10 && day === 31 },
];

/**
 * Resolve full date theme (shapes + card colors) for a puzzle seed.
 */
export function getDateThemeIdForSeed(seed: string): DateThemeId {
  const parsed = parseSeedDate(seed);
  if (!parsed) return DEFAULT_DATE_THEME;
  for (const rule of rules) {
    if (rule.match(seed, parsed)) return rule.id;
  }
  return DEFAULT_DATE_THEME;
}

/** @deprecated Use getDateThemeIdForSeed — same behavior. */
export function getShapeThemeIdForSeed(seed: string): DateThemeId {
  return getDateThemeIdForSeed(seed);
}
