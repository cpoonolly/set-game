import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SetGame } from "./SetGame";
import { FoundSets } from "./FoundSets";
import { GameBoard } from "./GameBoard";

const App: React.FC = () => {
  const gameDate = useMemo(() => {
    return new Date();
  }, []);

  const game = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const seed = urlParams.get("seed") || gameDate.toISOString().split("T")[0];
    return new SetGame(seed);
  }, [gameDate]);

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

  const formattedGameDate: string = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "utc",
    }).format(gameDate);
  }, [gameDate]);

  return (
    <div className="text-center p-2 xl:p-5">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mt-8 mb-2">Set Daily Card Game</h1>
        <h2 className="text-xl font-medium mb-5">{formattedGameDate}</h2>
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
