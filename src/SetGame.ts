import { Set } from 'immutable';
import seedrandom from 'seedrandom';
import { sampleSize } from './utils';
import { BOARD_SIZE, SET_SIZE, SET_COUNT, ALL_CARDS, ALL_VALID_SETS } from './constants';
import { Card, Board, GameEventType, GameEvent } from './types';

export function generateRandomBoard(numCards: number, numSets: number, seed: string): Board {
    const randomGenerator = seedrandom(seed);
    let attemptCount = 0;

    while (true) {
        console.log(`Generating random board (seed: ${seed}, attempt: ${attemptCount})`);

        const setsInBoard = sampleSize(ALL_VALID_SETS, numSets, randomGenerator);
        let cardsInBoard = setsInBoard.reduce(
            (acc, validSet) => acc.union(validSet),
            Set<Card>()
        );

        console.log(` - setsInBoard: ${setsInBoard}`);
        console.log(` - cardsInBoard: ${cardsInBoard}`);

        for (let card of ALL_CARDS) {
            if (cardsInBoard.size >= numCards) break;

            if (cardsInBoard.has(card)) {
                console.log(` - skipping card (already in board): ${card}`);
                continue;
            }
            
            const cardFormsNewSet = ALL_VALID_SETS
                .some(set => set.has(card) && set.intersect(cardsInBoard).size > 2);

            if (cardFormsNewSet) {
                console.log(` - skipping card (forms a new set): ${card}`);
                continue;
            }

            cardsInBoard = cardsInBoard.add(card);
            console.log(` - adding card: ${card}`);
        }

        if (cardsInBoard.size === numCards) {
            return {cards: cardsInBoard, sets: Set(setsInBoard)};
        }

        console.log(` - ending boardSize: ${cardsInBoard.size} - trying again...`);
        attemptCount++;

        if (attemptCount > 1000) {
            throw Error(`Failed to generate board after ${attemptCount} attemps`);
        }
    }
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
        this.board.sets.toArray().forEach(set => console.log(` - ` + JSON.stringify(set)));
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
        if (this.currentSet.size === SET_SIZE) this.currentSet = Set([]);

        this.currentSet = this.currentSet.add(card);
        if (this.currentSet.size !== SET_SIZE) return;

        const isFoundSet = this.foundSets.has(this.currentSet);
        const isValidSet = this.board.sets.has(this.currentSet);

        console.log('currentSet', JSON.stringify(this.currentSet));

        if (isFoundSet) {
            this.events.push({type: GameEventType.SET_ALREADY_FOUND, set: this.currentSet});
        } else if (isValidSet) {
            this.events.push({type: GameEventType.SET_FOUND, set: this.currentSet});
            this.foundSets = this.foundSets.add(this.currentSet);
        } else {
            this.events.push({type: GameEventType.INVALID_SET, set: this.currentSet});
        }

        if (this.isComplete) {
            this.endTime = new Date();
        }
    }
}