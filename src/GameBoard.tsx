import { FC } from "react";
import Card from "./Card";
import { SetGame } from "./SetGame";
import { Card as CardType, GameEvent } from "./types";
import { SET_SIZE } from "./constants";

interface GameBoardProps {
  formattedTime: string;
  game: SetGame;
  selectedCards: Immutable.Set<CardType>;
  handleCardClick: (card: CardType) => void;
  lastEvent: GameEvent;
}

export const GameBoard: FC<GameBoardProps> = ({
  formattedTime,
  game,
  selectedCards,
  handleCardClick,
  lastEvent,
}) => {
  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex flex-row justify-center items-center gap-x-8 font-bold text-lg">
        <p>Time: {formattedTime}</p>
        {game.isComplete && <p className="text-green-600">Game Complete! 🎉</p>}
      </div>

      <div className="grid grid-cols-3 xl:grid-cols-4 gap-2.5 max-w-4xl justify-center items-center">
        {Array.from(game.board.cards).map((card) => (
          <Card
            key={card}
            card={card}
            isSelected={selectedCards.has(card)}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      {lastEvent && selectedCards.size === SET_SIZE ? (
        <div className="font-bold text-lg">
          {lastEvent.type === 0 && (
            <p className="text-green-600">Set found! ✓</p>
          )}
          {lastEvent.type === 1 && (
            <p className="text-amber-500">Set already found!</p>
          )}
          {lastEvent.type === 2 && (
            <p className="text-red-600">Invalid set! ✗</p>
          )}
        </div>
      ) : (
        // Empty space for the last event to be displayed
        <div className="h-7" />
      )}
    </div>
  );
};
