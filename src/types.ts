import { Set } from 'immutable';

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