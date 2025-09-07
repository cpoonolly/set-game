import { FC } from "react";
import Card from "./Card";
import { SetGame } from "./SetGame";
import { Card as CardType } from "./types";

interface GameBoardProps {
  formattedTime: string;
  game: SetGame;
  selectedCards: Immutable.Set<CardType>;
  handleCardClick: (card: CardType) => void;
}

export const GameBoard: FC<GameBoardProps> = ({
  formattedTime,
  game,
  selectedCards,
  handleCardClick,
}) => {
  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex flex-row justify-center items-center gap-x-8 font-bold text-lg">
        <p>Time: {formattedTime}</p>
        {game.isComplete && <p className="complete">Game Complete! 🎉</p>}
      </div>
      <div className="game-board">
        {Array.from(game.board.cards).map((card) => (
          <Card
            key={card}
            card={card}
            isSelected={selectedCards.has(card)}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>
    </div>
  );
};
