import { FC } from "react";
import Card from "./Card";
import type { DateThemeId } from "./dateShapeTheme";

interface FoundSetsProps {
  sets: string[][];
  setCount: string;
  dateThemeId: DateThemeId;
}

export const FoundSets: FC<FoundSetsProps> = ({
  sets,
  setCount,
  dateThemeId,
}) => {
  return (
    <div className="flex flex-col gap-y-6.5">
      <h3 className="text-lg font-bold">Found Sets {setCount}</h3>

      <div className="flex flex-col items-center justify-center">
        {sets.length > 0 ? (
          sets.map((set, index) => (
            <div key={index} className="flex flex-row gap-x-1">
              {set.map((card, index) => (
                <Card
                  key={index}
                  card={card}
                  dateThemeId={dateThemeId}
                  readOnly
                />
              ))}
            </div>
          ))
        ) : (
          // Empty space for the found sets to be displayed
          <div className="w-76" />
        )}
      </div>
    </div>
  );
};
