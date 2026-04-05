import { Color, Fill } from "./types";
import type { DateThemeId } from "./dateShapeTheme";

/** Stroke + solid fill for one logical SET color (empty fill still uses white in resolveThemeColors). */
export type ThemeColorPair = { stroke: string; solid: string };

const defaultPalette: Record<Color, ThemeColorPair> = {
  /* GREEN */
  [Color.ONE]: { stroke: "#4CAF50", solid: "#4CAF50" },
  /* RED */
  [Color.TWO]: { stroke: "#F44336", solid: "#F44336" },
  /* PURPLE */
  [Color.THREE]: { stroke: "#9C27B0", solid: "#9C27B0" },
};

/** Easter: spring-leaning hues; adjust freely per holiday. */
const easterPalette: Record<Color, ThemeColorPair> = {
  /** BLUE */
  [Color.ONE]: { stroke: "#049BD6", solid: "#6BD0E3" },
  /* GREEN */
  [Color.TWO]: { stroke: "#209E0B", solid: "#83DB74" },
  /* ORANGE */
  [Color.THREE]: { stroke: "#F58027", solid: "#F59971" },
};

const palettes: Record<DateThemeId, Record<Color, ThemeColorPair>> = {
  default: defaultPalette,
  easter: easterPalette,
};

/**
 * Map encoded card color + fill to SVG colors for a date theme.
 * Stripes use `fillColor` in the pattern (see Shape.tsx defs).
 */
export function resolveThemeColors(
  themeId: DateThemeId,
  color: Color,
  fill: Fill
): { strokeColor: string; fillColor: string } {
  const table = palettes[themeId] ?? palettes.default;
  const pair = table[color];
  return {
    strokeColor: pair.stroke,
    fillColor: fill === Fill.EMPTY ? "white" : pair.solid,
  };
}
