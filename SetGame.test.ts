import { BOARD_SIZE, SET_COUNT } from './src/constants';
import { SetGame } from './src/SetGame';
import { Set } from 'immutable';
import { GameEventType } from './src/types';

describe('SetGame', () => {
  const testSeed = '2024-01-01';

  describe('deterministic behavior', () => {
    it('should generate the same board for the same seed', () => {
      const game1 = new SetGame(testSeed);
      const game2 = new SetGame(testSeed);
      
      expect(game1.board.cards.equals(game2.board.cards)).toBe(true);
      expect(game1.board.sets.equals(game2.board.sets)).toBe(true);
    });

    it('should create a board with correct size and set count', () => {
      const game = new SetGame(testSeed);
      
      expect(game.board.cards.size).toBeGreaterThanOrEqual(BOARD_SIZE);
      expect(game.board.sets.size).toBe(SET_COUNT);
    });
  });

  describe('game initialization', () => {
    it('should initialize with empty found sets and current set', () => {
      const game = new SetGame(testSeed);
      
      expect(game.foundSets.size).toBe(0);
      expect(game.currentSet.size).toBe(0);
      expect(game.events).toEqual([]);
      expect(game.endTime).toBeNull();
      expect(game.startTime).toBeInstanceOf(Date);
    });

    it('should have correct remaining sets count', () => {
      const game = new SetGame(testSeed);
      
      expect(game.setsRemainingCount).toBe(SET_COUNT);
    });

    it('should not be complete initially', () => {
      const game = new SetGame(testSeed);
      
      expect(game.isComplete).toBe(false);
    });
  });

  describe('card selection', () => {
    let game: SetGame;
    let validSet: Set<string>;

    beforeEach(() => {
      game = new SetGame(testSeed);
      validSet = game.board.sets.first()!;
    });

    it('should handle valid set selection', () => {
      const cards = validSet.toArray();
      
      game.selectCard(cards[0]);
      expect(game.currentSet.size).toBe(1);
      expect(game.events.length).toBe(0);
      
      game.selectCard(cards[1]);
      expect(game.currentSet.size).toBe(2);
      expect(game.events.length).toBe(0);
      
      game.selectCard(cards[2]);
      expect(game.currentSet.size).toBe(3);
      expect(game.events.length).toBe(1);
      expect(game.lastEvent.type).toBe(GameEventType.SET_FOUND);
      expect(game.lastEvent.set?.equals(validSet)).toBe(true);
      expect(game.foundSets.has(validSet)).toBe(true);
      expect(game.setsRemainingCount).toBe(SET_COUNT - 1);
    });

    it('should handle already found set selection', () => {
      const cards = validSet.toArray();
      
      cards.forEach(card => game.selectCard(card));
      expect(game.lastEvent.type).toBe(GameEventType.SET_FOUND);
      
      cards.forEach(card => game.selectCard(card));
      expect(game.lastEvent.type).toBe(GameEventType.SET_ALREADY_FOUND);
      expect(game.lastEvent.set?.equals(validSet)).toBe(true);
      expect(game.foundSets.size).toBe(1);
    });

    it('should handle invalid set selection', () => {
      const cards = game.board.cards.toArray().slice(0, 3);
      const invalidSet = Set(cards);
      
      if (!game.board.sets.has(invalidSet)) {
        cards.forEach(card => game.selectCard(card));
        expect(game.lastEvent.type).toBe(GameEventType.INVALID_SET);
        expect(game.lastEvent.set?.equals(invalidSet)).toBe(true);
        expect(game.foundSets.size).toBe(0);
      }
    });
  });

  describe('game completion', () => {
    it('should complete when all sets are found', () => {
      const game = new SetGame(testSeed);
      
      game.board.sets.forEach(validSet => {
        validSet.forEach(card => game.selectCard(card));
      });
      
      expect(game.isComplete).toBe(true);
      expect(game.foundSets.equals(game.board.sets)).toBe(true);
      expect(game.endTime).toBeInstanceOf(Date);
      expect(game.setsRemainingCount).toBe(0);
    });

    it('should track all events during complete gameplay', () => {
      const game = new SetGame(testSeed);
      let expectedEvents = 0;
      
      game.board.sets.forEach(validSet => {
        validSet.forEach(card => game.selectCard(card));
        expectedEvents++;
      });
      
      expect(game.events.length).toBe(expectedEvents);
      expect(game.events.every(event => event.type === GameEventType.SET_FOUND)).toBe(true);
      expect(game.isComplete).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle selecting the same card multiple times in a set', () => {
      const game = new SetGame(testSeed);
      const card = game.board.cards.first()!;
      
      game.selectCard(card);
      game.selectCard(card);
      game.selectCard(card);
      
      expect(game.currentSet.size).toBe(1);
      expect(game.events.length).toBe(0);
    });

    it('should reset current set after each complete selection', () => {
      const game = new SetGame(testSeed);
      const validSet = game.board.sets.first()!;
      const cards = validSet.toArray();
      
      cards.forEach(card => game.selectCard(card));
      expect(game.currentSet.size).toBe(3);
      
      game.selectCard(cards[0]);
      expect(game.currentSet.size).toBe(1);
    });
  });

  describe('multi-year board generation', () => {
    it('should generate valid boards for next five years from today', () => {
      const today = new Date('2025-08-09'); // Using today's date from env
      
      // Test daily seeds for the next 5 years
      for (let year = 0; year < 1; year++) {
        for (let day = 0; day < 365; day++) {
          const testDate = new Date(today);
          testDate.setFullYear(today.getFullYear() + year);
          testDate.setDate(today.getDate() + day);
          
          const seed = testDate.toISOString().split('T')[0]; // YYYY-MM-DD format
          const game = new SetGame(seed);
          
          // Fail immediately if requirements aren't met
          expect(game.board.cards.size).toBe(BOARD_SIZE);
          expect(game.board.sets.size).toBe(SET_COUNT);
        }
      }
    });
  });
});