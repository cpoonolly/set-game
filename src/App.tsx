import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SetGame } from "./SetGame";
import Card from "./Card";
import "./App.css";
import { SET_SIZE } from "./constants";
import { FoundSets } from "./FoundSets";

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
    <div className="app">
      <header className="app-header">
        <h1 className="text-3xl font-bold mt-8 mb-5">Set Card Game</h1>
        <div className="game-info">
          <p>
            Sets Found: {game.foundSets.size}/{game.board.sets.size}
          </p>
          <p>Time: {formattedTime}</p>
          {game.isComplete && <p className="complete">Game Complete! 🎉</p>}
        </div>
      </header>

      <div className="flex flex-row gap-2">
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

        <FoundSets
          sets={Array.from(game.foundSets).map((set) => set.toArray())}
        />
      </div>

      {lastEvent && selectedCards.size === SET_SIZE && (
        <div className="last-event">
          {lastEvent.type === 0 && <p className="success">Set found! ✓</p>}
          {lastEvent.type === 1 && (
            <p className="warning">Set already found!</p>
          )}
          {lastEvent.type === 2 && <p className="error">Invalid set! ✗</p>}
        </div>
      )}
    </div>
  );
};

export default App;
