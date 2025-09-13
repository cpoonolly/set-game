import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SetGame } from "./SetGame";
import { SET_SIZE } from "./constants";
import { FoundSets } from "./FoundSets";
import { GameBoard } from "./GameBoard";

const App: React.FC = () => {
  const game = useMemo(
    () => new SetGame(new Date().toISOString().split("T")[0]),
    []
  );

  const [tickCount, setTickCount] = useState<number>(0);
  const tick = useCallback(
    () => setTickCount((prev) => prev + 1),
    [setTickCount]
  );

  const handleCardClick = useCallback(
    (card: string) => {
      if (game.isComplete) return;

      game.selectCard(card);
      tick();
    },
    [game, tickCount, tick]
  );

  useEffect(() => {
    const timer = setInterval(tick, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!game.lastEvent) return;

    setTimeout(() => {
      game.currentSet = game.currentSet.clear();
      tick();
    }, 750);
  }, [game.lastEvent]);

  const selectedCards = useMemo(() => game.currentSet, [game, tickCount]);
  const lastEvent = useMemo(() => game.lastEvent, [game, tickCount]);

  const elapsedSeconds = useMemo(() => {
    const now = game.endTime || new Date();
    return Math.floor((now.getTime() - game.startTime.getTime()) / 1000);
  }, [game, tickCount]);

  const formattedTime: string = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [elapsedSeconds]);

  return (
    <div className="text-center p-2 xl:p-5">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mt-8 mb-5">Set Card Game</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-16 lg:mx-16 justify-around">
        <GameBoard
          formattedTime={formattedTime}
          game={game}
          selectedCards={selectedCards}
          handleCardClick={handleCardClick}
          lastEvent={lastEvent}
        />

        <FoundSets
          sets={Array.from(game.foundSets).map((set) => set.toArray())}
          setCount={`(${game.foundSets.size}/${game.board.sets.size})`}
        />
      </div>
    </div>
  );
};

export default App;
