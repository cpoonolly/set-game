import { Set } from 'immutable';

export type Card = string;

export enum Shape {
    RECTANGLE = 'a',
    OVAL = 'b', 
    DIAMOND = 'c'
}

export enum Color {
    GREEN = 'a',
    RED = 'b',
    PURPLE = 'c'
}

export enum Fill {
    SOLID = 'a',
    EMPTY = 'b',
    STRIPED = 'c'
}

export enum Count {
    ONE = 'a',
    TWO = 'b',
    THREE = 'c'
}

export interface CardProperties {
    shape: Shape;
    color: Color;
    fill: Fill;
    count: Count;
}

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