import { Set } from 'immutable';
import _lodash from 'lodash'
import seedrandom from 'seedrandom'

const dateString = new Date().toISOString().split('T')[0];
seedrandom(dateString, { global: true });
const _ = _lodash.runInContext();

export const BOARD_SIZE = 12;
export const SET_SIZE = 3;
export const SET_COUNT = 6;

export type Card = string;

export interface Board {
    cards: Set<Card>,
    sets: Set<Set<Card>>
}

export enum GameEventType {
    SET_FOUND,
    SET_ALREADY_FOUND,
    INVALID_SET,
}

export interface GameEvent {
    type: GameEventType;
    set?: Set<Card>;
}

export const allCards: Card[] = [
    "baaa", "bcca", "bbab", "bcab", "bcbc", "acbb", "caba", "caca", "bcaa", "abcc", "cbab", "acbc", "abab",
    "aaaa", "bbac", "baca", "abcb", "cbca", "aabb", "ccab", "ccba", "bbca", "bcba", "caaa", "ccbc", "cbba",
    "aaac", "cbbc", "abbc", "accc", "ccca", "caab", "cabc", "bbbb", "cbcb", "babb", "aabc", "bbbc", "bacb",
    "bacc", "cbaa", "bcbb", "abba", "baac", "cccb", "ccaa", "abbb", "caac", "baab", "aacb", "cacc", "abaa",
    "bbcc", "acba", "abac", "baba", "aaab", "ccbb", "aaca", "aaba", "babc", "acac", "cbac", "cbcc", "cccc",
    "bbba", "abca", "bccb", "acaa", "bccc", "accb", "aacc", "bbaa", "cabb", "bbcb", "ccac", "bcac", "acab",
    "acca", "cbbb", "cacb"
];

export const allValidSets: Set<Card>[] = [
    Set(["aabc", "bccb", "cbaa"]), Set(["accb", "cbab", "babb"]), Set(["bcaa", "cbba", "aaca"]), Set(["bcac", "abbc", "cacc"]),
    Set(["abcb", "bcab", "cabb"]), Set(["abab", "bcab", "caab"]), Set(["babc", "ccac", "abcc"]), Set(["caba", "bcab", "abcc"]),
    Set(["cbaa", "aaba", "bcca"]), Set(["aabc", "bcab", "cbca"]), Set(["acac", "caac", "bbac"]), Set(["baca", "abbc", "ccab"]),
    Set(["bbbc", "acbc", "cabc"]), Set(["caac", "bcbc", "abcc"]), Set(["bcac", "caac", "abac"]), Set(["caba", "acca", "bbaa"]),
    Set(["aaab", "cbab", "bcab"]), Set(["bbca", "caaa", "acba"]), Set(["accc", "cbac", "babc"]), Set(["aabc", "bcac", "cbcc"]),
    Set(["bacb", "abbc", "ccaa"]), Set(["ccab", "baba", "abcc"]), Set(["cbab", "bcbb", "aacb"]), Set(["abbc", "babc", "ccbc"]),
    Set(["abca", "bcba", "caaa"]), Set(["abbb", "bcab", "cacb"]), Set(["acbb", "bbcb", "caab"]), Set(["abab", "bccb", "cabb"]),
    Set(["abab", "ccab", "baab"]), Set(["caab", "abcb", "bcbb"]), Set(["bcac", "cbac", "aaac"]), Set(["aabc", "bcbc", "cbbc"]),
    Set(["baac", "abcc", "ccbc"]), Set(["bcac", "cbca", "aabb"]), Set(["aabc", "babc", "cabc"]), Set(["cbcb", "bcab", "aabb"]),
    Set(["caba", "abca", "bcaa"]), Set(["caba", "bcca", "abaa"]), Set(["acac", "baac", "cbac"]), Set(["bccb", "cbab", "aabb"]),
    Set(["baac", "ccac", "abac"]), Set(["abcb", "ccbb", "baab"]), Set(["cbac", "aacc", "bcbc"]), Set(["baaa", "ccba", "abca"]),
    Set(["acca", "baba", "cbaa"]), Set(["cbbc", "babc", "acbc"]), Set(["accb", "cabb", "bbab"]), Set(["bbab", "acab", "caab"]),
    Set(["aabc", "bccc", "cbac"]), Set(["bccc", "cabc", "abac"]), Set(["baba", "abca", "ccaa"]), Set(["abbc", "ccac", "bacc"]),
    Set(["abba", "caca", "bcaa"]), Set(["bcba", "caab", "abcc"]), Set(["cabb", "acab", "bbcb"]), Set(["cbab", "acab", "baab"]),
    Set(["abbc", "bcab", "caca"]), Set(["bcac", "cabc", "abcc"]), Set(["acac", "bbcc", "cabc"]), Set(["ccba", "abcc", "baab"]),
    Set(["caac", "acbc", "bbcc"]), Set(["bcab", "aacc", "cbba"]), Set(["cbbc", "bcac", "aacc"]), Set(["baca", "abba", "ccaa"]),
    Set(["abbc", "bcbc", "cabc"]), Set(["caba", "bbca", "acaa"]), Set(["abcb", "ccab", "babb"]), Set(["bcab", "aacb", "cbbb"]),
    Set(["accc", "cabc", "bbac"]), Set(["abbc", "bcaa", "cacb"]), Set(["caba", "acab", "bbcc"]), Set(["aaba", "bcaa", "cbca"]),
    Set(["cbaa", "bcba", "aaca"]), Set(["abbb", "bacb", "ccab"]), Set(["aabc", "cbab", "bcca"]), Set(["aabc", "bcaa", "cbcb"])
];

export function generateRandomBoard(numCards: number, numSets: number): Board {
    while (true) {
        console.log("Attempting to create board");

        const setsInBoard = _.sampleSize(allValidSets, numSets);
        let cardsInBoard = setsInBoard.reduce(
            (acc, validSet) => acc.union(validSet),
            Set<Card>()
        );

        console.log(` - setsInBoard: ${setsInBoard}`);
        console.log(` - cardsInBoard: ${cardsInBoard}`);

        for (let card of allCards) {
            if (cardsInBoard.size > numCards) break;

            if (cardsInBoard.has(card)) {
                console.log(` - skipping card (already in board): ${card}`);
                continue;
            }
            
            const cardFormsNewSet = allValidSets
                .some(set => set.has(card) && set.intersect(cardsInBoard).size > 2);

            if (cardFormsNewSet) {
                console.log(` - skipping card (forms a new set): ${card}`);
                continue;
            }

            cardsInBoard = cardsInBoard.add(card);
            console.log(` - adding card: ${card}`);
        }

        if (cardsInBoard.size > numCards) {
            return {cards: cardsInBoard, sets: Set(setsInBoard)};
        }

        console.log(` - FAILED`);
    }
}

export class SetGame {
    board: Board;
    startTime: Date;
    endTime: Date | null;
    foundSets: Set<Set<Card>>;
    currentSet: Set<Card>;
    events: GameEvent[];

    constructor() {
        this.board = generateRandomBoard(BOARD_SIZE, SET_COUNT);
        this.startTime = new Date();
        this.endTime = null;
        this.foundSets = Set([]);
        this.currentSet = Set([]);
        this.events = [];
    }

    get setsRemainingCount() {
        return this.board.sets.size - this.foundSets.size;
    }

    get isComplete() {
        return this.foundSets.equals(this.board.sets);
    }

    get lastEvent() {
        return this.events[this.events.length-1];
    }

    selectCard(card: Card) {
        this.currentSet = this.currentSet.add(card);
        if (this.currentSet.size !== SET_SIZE) return;

        const isFoundSet = this.foundSets.has(this.currentSet);
        const isValidSet = this.board.sets.has(this.currentSet);

        if (isFoundSet) {
            this.events.push({type: GameEventType.SET_ALREADY_FOUND, set: this.currentSet});
        } else if (isValidSet) {
            this.events.push({type: GameEventType.SET_FOUND, set: this.currentSet});
            this.foundSets.add(this.currentSet);
        } else {
            this.events.push({type: GameEventType.INVALID_SET, set: this.currentSet});
        }

        if (this.isComplete) {
            this.endTime = new Date();
        }

        this.currentSet = Set([]);
    }
}