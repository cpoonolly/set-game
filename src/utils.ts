import { Set } from 'immutable';

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