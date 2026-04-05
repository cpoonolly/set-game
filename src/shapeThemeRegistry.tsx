import React from "react";
import { Shape as ShapeEnum } from "./types";
import type { DateThemeId } from "./dateShapeTheme";

export type ShapeFillProps = {
  card: string;
  strokeColor: string;
  fillColor: string;
  isStriped: boolean;
};

type Inner = React.ReactElement;

function stripeFill(
  card: string,
  _fillColor: string,
  isStriped: boolean,
  solid: string
): string {
  return isStriped ? `url(#${card}_stripes)` : solid;
}

/** Standard SET shapes (current production art). */
const defaultShapes: Record<ShapeEnum, (p: ShapeFillProps) => Inner> = {
  [ShapeEnum.OVAL]: ({ card, strokeColor, fillColor, isStriped }) => (
    <ellipse
      cx="25"
      cy="50"
      rx="18"
      ry="35"
      fill={stripeFill(card, fillColor, isStriped, fillColor)}
      stroke={strokeColor}
      strokeWidth="5"
    />
  ),
  [ShapeEnum.DIAMOND]: ({ card, strokeColor, fillColor, isStriped }) => (
    <polygon
      points="25,10 40,50 25,90 10,50"
      fill={stripeFill(card, fillColor, isStriped, fillColor)}
      stroke={strokeColor}
      strokeWidth="5"
    />
  ),
  [ShapeEnum.SQUIGGLE]: ({ card, strokeColor, fillColor, isStriped }) => (
    <path
      d="M 12 90 C 29.5 97, 48.6 78.8, 43.2 57.4 C 41 48.8, 33.6 40.8, 42.4 28.6 C 52.5 14.7, 46.6 11.3, 36 11 C 23.6 10.7, 10.8 22.3, 12.6 35.8 C 12.2 54.4, 25.2 56.5, 11.2 78.2 C 8 83.2, 5.5 87.7, 12 90 Z"
      fill={stripeFill(card, fillColor, isStriped, fillColor)}
      stroke={strokeColor}
      strokeWidth="5"
    />
  ),
};

/** Easter: three distinct silhouettes mapped to the same logical shape slots (Oval / Diamond / Squiggle). */
const easterShapes: Record<ShapeEnum, (p: ShapeFillProps) => Inner> = {
  /** EASTER EGG */
  [ShapeEnum.OVAL]: ({ card, strokeColor, fillColor, isStriped }) => (
    <g>
        <path
          d="
          M28,21
          C17,21 11,43 11,57
          C11,72 20,79 28,79
          C36,79 45,72 45,57
          C45,43 39,21 28,21
          Z"
          fill={isStriped ? `url(#${card}_stripes)` : fillColor}
          stroke={strokeColor}
          strokeWidth={3}
        />
    </g>
  ),
  /** BUNNY */
  [ShapeEnum.DIAMOND]: ({ card, strokeColor, fillColor, isStriped }) => (
        <g>

    
          {/* Bunny ears */}
          <ellipse
            cx={13} cy={35} rx={8} ry={25}
            fill={isStriped ? `url(#${card}_stripes)` : fillColor}
            stroke={strokeColor} strokeWidth={3}
          />
          <ellipse
            cx={37} cy={35} rx={8} ry={25}
            fill={isStriped ? `url(#${card}_stripes)` : fillColor}
            stroke={strokeColor} strokeWidth={3}
          />
          
          {/* Bunny head */}
          <circle
            cx={25} cy={65} r={20}
            fill={isStriped ? `url(#${card}_stripes)` : fillColor}
            stroke={strokeColor} strokeWidth={3}
          />
    
          {/* Inner ears */}
          <ellipse
            cx={13} cy={35} rx={2} ry={12}
            fill={isStriped ? `url(#${card}_stripes)` : fillColor}
            stroke={strokeColor} strokeWidth={2}
          />
          <ellipse
            cx={37} cy={35} rx={2} ry={12}
            fill={isStriped ? `url(#${card}_stripes)` : fillColor}
            stroke={strokeColor} strokeWidth={2}
          />
    
          {/* Eyes */}
          <circle cx={20} cy={65} r={2} fill="#000" />
          <circle cx={30} cy={65} r={2} fill="#000" />
    
          {/* Nose */}
          <circle cx={25} cy={71} r={2} fill="#FF69B4" />
        </g>

  ),

  [ShapeEnum.SQUIGGLE]: ({ card, strokeColor, fillColor, isStriped }) => (
    /** CARROT */
    <g stroke={strokeColor} strokeWidth="4" strokeLinejoin="round">
         {/* Root */}
    <path
      fill={isStriped ? `url(#${card}_stripes)` : fillColor}
      d="M41.1 42.92c.55-3.28-1.7-5.92-5-5.92h-14c-3.32 0-5.56 2.65-5.02 5.92l.85 5.08h8.66l-8.28 2.48 4.14 24.83 7.1 1.2-6.7 1.14 1.56 9.43C24.8 89.23 26.9 91 29.1 91s4.3-1.77 4.65-3.95l3.9-23.4L29.6 62l8.47-.86 3.04-18.22z"
    />
    {/* Stem */}
    <path
      fill={isStriped ? `url(#${card}_stripes)` : fillColor}
      d="M29.6 28.56L25.9 10.5c-.22-1.07-1.1-1.38-1.94-.7l-6.14 5c-.85.7-1.06 2-.45 2.93l10.7 16.43c.3.46 1 .84 1.55.84.56 0 1.27-.35 1.62-.8l10.54-13.56c.68-.88.43-1.97-.57-2.45l-3.7-1.8c-1-.48-2.16-.05-2.62.94l-5.25 11.2z"
    />
    </g>
  ),
};

const themes: Record<
  DateThemeId,
  Record<ShapeEnum, (p: ShapeFillProps) => Inner>
> = {
  default: defaultShapes,
  easter: easterShapes,
};

export function renderThemedShape(
  themeId: DateThemeId,
  shape: ShapeEnum,
  props: ShapeFillProps
): Inner {
  const table = themes[themeId] ?? themes.default;
  const render = table[shape] ?? themes.default[shape];
  return render(props);
}
