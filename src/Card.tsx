import React from "react";
import clsx from "clsx";
import Shape from "./Shape";
import { Card as CardType, Fill, Count } from "./types";
import { getCardProperties } from "./utils";
import type { DateThemeId } from "./dateShapeTheme";
import { resolveThemeColors } from "./cardColorThemes";

interface CardProps {
  card: CardType;
  dateThemeId: DateThemeId;
  onClick?: () => void;
  isSelected?: boolean;
  readOnly?: boolean;
  isGameComplete?: boolean;
}

const Card: React.FC<CardProps> = ({
  card,
  dateThemeId,
  onClick,
  isSelected = false,
  readOnly = false,
  isGameComplete = false,
}) => {
  const properties = getCardProperties(card);

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

  const { strokeColor, fillColor } = resolveThemeColors(
    dateThemeId,
    properties.color,
    properties.fill
  );
  const isStriped = getIsStriped(properties.fill);
  const shapeCount = getShapeCount(properties.count);

  const DEFAULT_CARD_CLASSNAME =
    "border-2 rounded-md p-5 transition-all duration-200 h-24 w-32 md:h-32 md:w-52 lg:gap-2 lg:p-2";

  const READ_ONLY_CARD_CLASSNAME = "h-16 w-24 m-0.5 rounded-sm";

  return (
    <div
      className={clsx(
        "bg-white border border-gray-300 flex items-center justify-center mx-auto",
        readOnly
          ? READ_ONLY_CARD_CLASSNAME
          : [
              DEFAULT_CARD_CLASSNAME,
              !isGameComplete && "cursor-pointer",
              isSelected
                ? "border-orange-400 [&]:bg-orange-50 shadow-md"
                : [!isGameComplete && "hover:border-blue-500 hover:shadow-md"],
            ]
      )}
      onClick={onClick}
    >
      {Array.from({ length: shapeCount }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            readOnly
              ? [
                  "scale-50",
                  shapeCount === 3
                    ? "first:-mr-5 last:-ml-5"
                    : "first:-mr-2 last:-ml-2",
                ]
              : [
                  "scale-75 md:scale-100",
                  shapeCount === 3
                    ? "first:-mr-2 last:-ml-2 md:first:mr-0 md:last:ml-0"
                    : "md:first:mr-1 md:last:ml-1",
                ]
          )}
        >
          <Shape
            card={card}
            strokeColor={strokeColor}
            fillColor={fillColor}
            isStriped={isStriped}
            shape={properties.shape}
            themeId={dateThemeId}
          />
        </div>
      ))}
    </div>
  );
};

export default Card;
