import React, { useState } from 'react';
import { SetGame } from './SetGame';
import './App.css';

const App: React.FC = () => {
  const [game, setGame] = useState<SetGame>(() => new SetGame(Date.now().toString()));
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  const handleCardClick = (card: string) => {
    const newSelected = new Set(selectedCards);
    
    if (newSelected.has(card)) {
      newSelected.delete(card);
    } else {
      newSelected.add(card);
    }

    setSelectedCards(newSelected);

    if (newSelected.size === 3) {
      const newGame = new SetGame(game.board.cards.toString());
      newGame.board = game.board;
      newGame.foundSets = game.foundSets;
      newGame.events = [...game.events];
      newGame.startTime = game.startTime;
      newGame.endTime = game.endTime;
      newGame.currentSet = game.currentSet;

      Array.from(newSelected).forEach(selectedCard => {
        newGame.selectCard(selectedCard);
      });

      setGame(newGame);
      setSelectedCards(new Set());
    }
  };

  const handleNewGame = () => {
    setGame(new SetGame(Date.now().toString()));
    setSelectedCards(new Set());
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Set Card Game</h1>
        <div className="game-info">
          <p>Sets Found: {game.foundSets.size}/{game.board.sets.size}</p>
          <p>Sets Remaining: {game.setsRemainingCount}</p>
          {game.isComplete && <p className="complete">Game Complete! 🎉</p>}
        </div>
        <button onClick={handleNewGame} className="new-game-btn">
          New Game
        </button>
      </header>

      <div className="game-board">
        {Array.from(game.board.cards).map(card => (
          <div
            key={card}
            className={`card ${selectedCards.has(card) ? 'selected' : ''}`}
            onClick={() => handleCardClick(card)}
          >
            {card}
          </div>
        ))}
      </div>

      {game.lastEvent && (
        <div className="last-event">
          {game.lastEvent.type === 0 && <p className="success">Set found! ✓</p>}
          {game.lastEvent.type === 1 && <p className="warning">Set already found!</p>}
          {game.lastEvent.type === 2 && <p className="error">Invalid set! ✗</p>}
        </div>
      )}
    </div>
  );
};

export default App;