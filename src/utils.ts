import { Set } from 'immutable';
import { Card, CardProperties, Shape, Color, Fill, Count } from './types';

export function sampleSize<T>(array: T[], size: number, randomGenerator: () => number): T[] {
    const result: T[] = [];
    let indices = Set<number>();
    
    while (result.length < size && result.length < array.length) {
        const index = Math.floor(randomGenerator() * array.length);
        if (!indices.has(index)) {
            indices = indices.add(index);
            result.push(array[index]);
        }
    }
    
    return result;
}

export function getCardProperties(card: Card): CardProperties {
    if (card.length !== 4) {
        throw new Error(`Invalid card format: ${card}. Card must be exactly 4 characters.`);
    }
    
    const [shapeChar, colorChar, fillChar, countChar] = card;
    
    return {
        shape: shapeChar as Shape,
        color: colorChar as Color,
        fill: fillChar as Fill,
        count: countChar as Count
    };
}