import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import { SetGame } from "./SetGame";
import { FoundSets } from "./FoundSets";
import { GameBoard } from "./GameBoard";
import { AuthContextProvider } from "./contexts/AuthContext";
import PastGamesPage from "./components/PastGamesPage";

const AppInner: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const gameDate = useMemo(() => {
    return new Date();
  }, []);

  const game = useMemo(() => {
    const seed = searchParams.get("seed") || gameDate.toLocaleDateString('en-CA');
    const shouldLoad = searchParams.has("load");

    // Update URL with seed param if not already present
    if (!searchParams.has("seed")) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("seed", seed);
        return next;
      }, { replace: true });
    }

    // Load saved game if load param is present
    if (shouldLoad) {
      const loadedGame = SetGame.load(seed);
      if (loadedGame) {
        return loadedGame;
      }
    }

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
    }, 300);
  }, [game.lastEvent]);

  useEffect(() => {
    if (game.isComplete) {
      if (!searchParams.has("load")) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set("load", "1");
          return next;
        }, { replace: true });
      }
    }
  }, [game.isComplete]);

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
        <h2 className="text-xl font-medium mb-3">{formattedGameDate}</h2>
        <button
          onClick={() => navigate("/history")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Past Games
        </button>
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

const App: React.FC = () => (
  <AuthContextProvider>
    <Routes>
      <Route path="/" element={<AppInner />} />
      <Route path="/history" element={<PastGamesPage />} />
    </Routes>
  </AuthContextProvider>
);

export default App;
