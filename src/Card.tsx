import React from "react";
import clsx from "clsx";
import Shape from "./Shape";
import {
  Card as CardType,
  Shape as ShapeEnum,
  Color,
  Fill,
  Count,
} from "./types";
import { getCardProperties } from "./utils";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isSelected?: boolean;
  readOnly?: boolean;
}

const Card: React.FC<CardProps> = ({
  card,
  onClick,
  isSelected = false,
  readOnly = false,
}) => {
  const properties = getCardProperties(card);

  // Map enum values to Shape component props
  const getShapeType = (shape: ShapeEnum): "Oval" | "Diamond" | "Rectangle" => {
    switch (shape) {
      case ShapeEnum.RECTANGLE:
        return "Rectangle";
      case ShapeEnum.OVAL:
        return "Oval";
      case ShapeEnum.DIAMOND:
        return "Diamond";
    }
  };

  const getStrokeColor = (color: Color): string => {
    switch (color) {
      case Color.GREEN:
        return "#4CAF50";
      case Color.RED:
        return "#F44336";
      case Color.PURPLE:
        return "#9C27B0";
    }
  };

  const getFillColor = (color: Color, fill: Fill): string => {
    if (fill === Fill.EMPTY) {
      return "white";
    }
    // For solid and striped, use the same base color
    switch (color) {
      case Color.GREEN:
        return "#4CAF50";
      case Color.RED:
        return "#F44336";
      case Color.PURPLE:
        return "#9C27B0";
    }
  };

  const getIsStriped = (fill: Fill): boolean => {
    return fill === Fill.STRIPED;
  };

  const getShapeCount = (count: Count): number => {
    switch (count) {
      case Count.ONE:
        return 1;
      case Count.TWO:
        return 2;
      case Count.THREE:
        return 3;
    }
  };

  const shapeType = getShapeType(properties.shape);
  const strokeColor = getStrokeColor(properties.color);
  const fillColor = getFillColor(properties.color, properties.fill);
  const isStriped = getIsStriped(properties.fill);
  const shapeCount = getShapeCount(properties.count);

  const DEFAULT_CARD_CLASSNAME =
    "border-2 rounded-md p-5 cursor-pointer transition-all duration-200 h-32 w-52 gap-2 p-2";

  const READ_ONLY_CARD_CLASSNAME = "h-16 w-24 m-0.5 rounded-sm";

  return (
    <div
      className={clsx(
        "bg-white border border-gray-300 flex items-center justify-center",
        readOnly
          ? READ_ONLY_CARD_CLASSNAME
          : [
              DEFAULT_CARD_CLASSNAME,
              isSelected
                ? "border-orange-400 [&]:bg-orange-50 shadow-md"
                : "hover:border-blue-500 hover:shadow-md",
            ]
      )}
      onClick={onClick}
    >
      {Array.from({ length: shapeCount }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            readOnly && {
              "scale-50": true,
              "first:-mr-5 last:-ml-5": shapeCount === 3,
              "first:-mr-2 last:-ml-2": shapeCount !== 3,
            }
          )}
        >
          <Shape
            card={card}
            strokeColor={strokeColor}
            fillColor={fillColor}
            isStriped={isStriped}
            shape={shapeType}
          />
        </div>
      ))}
    </div>
  );
};

export default Card;
