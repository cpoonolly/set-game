import { Set } from "immutable";
import seedrandom from "seedrandom";
import { sampleSize } from "./utils";
import {
  BOARD_SIZE,
  SET_SIZE,
  SET_COUNT,
  ALL_CARDS,
  ALL_VALID_SETS,
} from "./constants";
import { Card, Board, GameEventType, GameEvent } from "./types";

function addCardToBoard(board: Board, card: Card): Board {
  const newSets = ALL_VALID_SETS.filter(
    (set) => set.has(card) && set.intersect(board.cards).size === 2
  );
  return { cards: board.cards.add(card), sets: board.sets.union(newSets) };
}

function removeCardFromBoard(board: Board, card: Card): Board {
  const setsToRemove = board.sets.filter((set) => set.contains(card));
  return {
    cards: board.cards.remove(card),
    sets: board.sets.subtract(setsToRemove),
  };
}

export function generateRandomBoard(
  numCards: number,
  numSets: number,
  seed: string
): Board {
  const randomGenerator = seedrandom(seed);
  const allCards: Set<Card> = Set(ALL_CARDS);
  let board: Board = { cards: Set([]), sets: Set([]) };
  let attempts = 0;
  let card;

  while (board.sets.size !== numSets || board.cards.size !== numCards) {
    console.log(`Generating random board (seed: ${seed}) - board: ${board})`);

    if (board.sets.size > numSets || board.cards.size > numCards) {
      card = sampleSize(board.cards.toArray(), 1, randomGenerator)[0];
      board = removeCardFromBoard(board, card);
    } else if (board.sets.size === numSets) {
      card = allCards
        .subtract(board.cards)
        .toArray()
        .find((c) => addCardToBoard(board, c).sets.size === numSets);
      if (!card) {
        card = sampleSize(board.cards.toArray(), 1, randomGenerator)[0];
        board = removeCardFromBoard(board, card);
      } else {
        board = addCardToBoard(board, card);
      }
    } else {
      card = sampleSize(
        allCards.subtract(board.cards).toArray(),
        1,
        randomGenerator
      )[0];
      board = addCardToBoard(board, card);
    }

    attempts++;
    if (attempts > 100000) throw new Error("Wow... who made this garbage");
  }

  return board;
}

export class SetGame {
  seed: string;
  board: Board;
  startTime: Date;
  endTime: Date | null;
  foundSets: Set<Set<Card>>;
  currentSet: Set<Card>;
  events: GameEvent[];

  constructor(seed: string) {
    this.seed = seed;
    const isAprilFools = seed.endsWith('04-01');
    const boardSize = isAprilFools ? 20 : BOARD_SIZE;
    const setCount = isAprilFools ? 15 : SET_COUNT;
    this.board = generateRandomBoard(boardSize, setCount, seed);
    this.startTime = new Date();
    this.endTime = null;
    this.foundSets = Set([]);
    this.currentSet = Set([]);
    this.events = [];

    console.log(`Valid Sets:`);
    this.board.sets
      .toArray()
      .forEach((set) => console.log(` - ` + JSON.stringify(set)));
  }

  get setsRemainingCount() {
    return this.board.sets.size - this.foundSets.size;
  }

  get isComplete() {
    return this.foundSets.equals(this.board.sets);
  }

  get lastEvent() {
    return this.events[this.events.length - 1];
  }

  get totalTimeMs() {
    if (!this.isComplete || !this.endTime) {
      return null;
    }

    return this.endTime.getTime() - this.startTime.getTime();
  }

  selectCard(card: Card) {
    if (this.currentSet.size === SET_SIZE) this.currentSet = Set([]);

    // If card is already selected, unselect it
    if (this.currentSet.has(card)) {
      this.currentSet = this.currentSet.remove(card);
      return;
    }

    this.currentSet = this.currentSet.add(card);
    if (this.currentSet.size !== SET_SIZE) return;

    const isFoundSet = this.foundSets.has(this.currentSet);
    const isValidSet = this.board.sets.has(this.currentSet);

    console.log("currentSet", JSON.stringify(this.currentSet));

    if (isFoundSet) {
      this.events.push({
        type: GameEventType.SET_ALREADY_FOUND,
        set: this.currentSet,
        time: new Date()
      });
    } else if (isValidSet) {
      this.events.push({
        type: GameEventType.SET_FOUND,
        set: this.currentSet,
        time: new Date()
      });
      this.foundSets = this.foundSets.add(this.currentSet);
    } else {
      this.events.push({
        type: GameEventType.INVALID_SET,
        set: this.currentSet,
        time: new Date()
      });
    }

    if (this.isComplete) {
      this.endTime = new Date();
      this.onGameComplete();
    }
  }

  getShareableMessage() {
    const totalTimeMs = this.totalTimeMs;
    if (!this.endTime || !totalTimeMs) {
      return "Set Game in progress...";
    }

    const totalSeconds = Math.floor(totalTimeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    const foundSetEvents = this.events.filter(e => e.type === GameEventType.SET_FOUND);
    const setTimings = foundSetEvents.map((event, index) => {
      const eventTime = event.time;
      const eventSeconds = Math.floor((eventTime.getTime() - this.startTime.getTime()) / 1000);
      const eventMins = Math.floor(eventSeconds / 60);
      const eventSecs = eventSeconds % 60;
      return `${eventMins}:${eventSecs.toString().padStart(2, "0")}`;
    }).join(", ");

    return ['🎯 Set Game Complete! 🎯', `⏱️ Time: ${formattedTime}`, `📈 Set Times: ${setTimings}`].join('\n');
  }

  async copyShareableMessage() {
    const message = this.getShareableMessage();
    await navigator.clipboard.writeText(message);
  }

  onGameComplete() {
    const existingGame = SetGame.load(this.seed);

    // If no existing game, or current game is faster, save it
    if (!existingGame || !existingGame.totalTimeMs ||
        (this.totalTimeMs && this.totalTimeMs < existingGame.totalTimeMs)) {
      this.save();
    }
  }

  save() {
    const serializedEvents = this.events.map(event => ({
      type: event.type,
      set: event.set ? event.set.toArray() : undefined,
      time: event.time.toISOString()
    }));

    const serializedFoundSets = this.foundSets.toArray().map(set => set.toArray());

    const gameData = {
      startTime: this.startTime.toISOString(),
      endTime: this.endTime ? this.endTime.toISOString() : null,
      events: serializedEvents,
      foundSets: serializedFoundSets
    };

    localStorage.setItem(`setgame_${this.seed}`, JSON.stringify(gameData));
  }

  static load(seed: string) {
    const storedData = localStorage.getItem(`setgame_${seed}`);

    if (!storedData) {
      return null;
    }

    const gameData = JSON.parse(storedData);
    const game = new SetGame(seed);

    game.startTime = new Date(gameData.startTime);
    game.endTime = gameData.endTime ? new Date(gameData.endTime) : null;
    game.events = gameData.events.map((event: any) => ({
      type: event.type,
      set: event.set ? Set(event.set) : undefined,
      time: new Date(event.time)
    }));
    game.foundSets = Set(gameData.foundSets.map((setArray: Card[]) => Set(setArray)));

    return game;
  }
}
