import React from "react";
import { Shape as ShapeEnum } from "./types";
import type { DateThemeId } from "./dateShapeTheme";
import { renderThemedShape } from "./shapeThemeRegistry";

interface ShapeProps {
  card: string;
  strokeColor: string;
  fillColor: string;
  isStriped: boolean;
  shape: ShapeEnum;
  themeId: DateThemeId;
}

const Shape: React.FC<ShapeProps> = ({
  card,
  strokeColor,
  fillColor,
  isStriped,
  shape,
  themeId,
}) => {
  return (
    <svg
      width="50"
      height="100"
      viewBox="0 0 50 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={`${card}_stripes`}
          patternUnits="userSpaceOnUse"
          width="10"
          height="10"
        >
          <rect width="10" height="10" fill="white" />
          <rect width="10" height="5" fill={fillColor} />
        </pattern>
      </defs>
      {renderThemedShape(themeId, shape, {
        card,
        strokeColor,
        fillColor,
        isStriped,
      })}
    </svg>
  );
};

export default Shape;
