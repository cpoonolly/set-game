import {
  westernEasterDateStringUtc,
  getDateThemeIdForSeed,
  getShapeThemeIdForSeed,
} from "./src/dateShapeTheme";
import { resolveThemeColors } from "./src/cardColorThemes";
import { Color, Fill } from "./src/types";

describe("dateShapeTheme", () => {
  it("computes known Western Easter Sundays (UTC date string)", () => {
    expect(westernEasterDateStringUtc(2025)).toBe("2025-04-20");
    expect(westernEasterDateStringUtc(2026)).toBe("2026-04-05");
    expect(westernEasterDateStringUtc(2024)).toBe("2024-03-31");
  });

  it("returns easter theme only on Easter Sunday seed", () => {
    expect(getDateThemeIdForSeed("2026-04-05")).toBe("easter");
    expect(getDateThemeIdForSeed("2026-04-04")).toBe("default");
    expect(getDateThemeIdForSeed("2026-04-06")).toBe("default");
  });

  it("defaults for invalid seeds", () => {
    expect(getDateThemeIdForSeed("not-a-date")).toBe("default");
    expect(getDateThemeIdForSeed("")).toBe("default");
  });

  it("getShapeThemeIdForSeed matches getDateThemeIdForSeed", () => {
    expect(getShapeThemeIdForSeed("2026-04-05")).toBe(
      getDateThemeIdForSeed("2026-04-05")
    );
  });
});

describe("cardColorThemes", () => {
  it("uses default SET palette for default theme", () => {
    expect(
      resolveThemeColors("default", Color.ONE, Fill.SOLID).fillColor
    ).toBe("#4CAF50");
  });

  it("uses themed palette for easter", () => {
    const g = resolveThemeColors("easter", Color.ONE, Fill.SOLID);
    expect(g.fillColor).toBe("#6BD0E3");
    expect(g.strokeColor).toBe("#049BD6");
  });

  it("keeps empty fill white across themes", () => {
    expect(resolveThemeColors("easter", Color.TWO, Fill.EMPTY).fillColor).toBe(
      "white"
    );
  });
});
