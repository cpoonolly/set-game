import React from "react";
import { Card } from "./types";

interface ShapeProps {
  card: Card;
  strokeColor: string;
  fillColor: string;
  isStriped: boolean;
  shape: "Oval" | "Diamond" | "Squiggle";
}

const Shape: React.FC<ShapeProps> = ({
  card,
  strokeColor,
  fillColor,
  isStriped,
  shape,
}) => {
  const shapes = [
    {
      name: "Oval",
      element: (
        <ellipse
          cx="25"
          cy="50"
          rx="18"
          ry="35"
          fill={isStriped ? `url(#${card}_stripes)` : fillColor}
          stroke={strokeColor}
          strokeWidth="5"
        />
      ),
    },
    {
      name: "Diamond",
      element: (
        <polygon
          points="25,10 40,50 25,90 10,50"
          fill={isStriped ? `url(#${card}_stripes)` : fillColor}
          stroke={strokeColor}
          strokeWidth="5"
        />
      ),
    },
    {
      name: "Squiggle",
      element: (
        <path
          d="M 12 90 C 29.5 97, 48.6 78.8, 43.2 57.4 C 41 48.8, 33.6 40.8, 42.4 28.6 C 52.5 14.7, 46.6 11.3, 36 11 C 23.6 10.7, 10.8 22.3, 12.6 35.8 C 12.2 54.4, 25.2 56.5, 11.2 78.2 C 8 83.2, 5.5 87.7, 12 90 Z"
          fill={isStriped ? `url(#${card}_stripes)` : fillColor}
          stroke={strokeColor}
          strokeWidth="5"
        />
      ),
    },
  ];

  // Find the current shape based on the shape prop
  const currentShape = shapes.findIndex((s) => s.name === shape);
  const selectedShape = currentShape !== -1 ? shapes[currentShape] : shapes[0]; // fallback to first shape

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 50 100"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
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
      {selectedShape.element}
    </svg>
  );
};

export default Shape;
