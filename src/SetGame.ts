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
  board: Board;
  startTime: Date;
  endTime: Date | null;
  foundSets: Set<Set<Card>>;
  currentSet: Set<Card>;
  events: GameEvent[];

  constructor(seed: string) {
    this.board = generateRandomBoard(BOARD_SIZE, SET_COUNT, seed);
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
      });
    } else if (isValidSet) {
      this.events.push({ type: GameEventType.SET_FOUND, set: this.currentSet });
      this.foundSets = this.foundSets.add(this.currentSet);
    } else {
      this.events.push({
        type: GameEventType.INVALID_SET,
        set: this.currentSet,
      });
    }

    if (this.isComplete) {
      this.endTime = new Date();
    }
  }
}
