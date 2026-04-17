import { getUtcStringDate } from 'tasks/task3';
import { setupMockDate, MockDateSetup } from './testUtils';

describe('getUtcStringDate', () => {
  let mockDate: MockDateSetup;

  beforeEach(() => {
    mockDate = setupMockDate();
  });

  afterEach(() => {
    mockDate.reset();
  });

  describe('with a specific date argument', () => {
    it('returns a UTC string in ISO8601 format', () => {
      const date = new Date('2007-01-31T23:15:00Z');
      expect(getUtcStringDate(date)).toBe('2007-01-31T23:15:00Z');
    });

    it('handles midnight correctly', () => {
      const date = new Date('2020-12-25T00:00:00Z');
      expect(getUtcStringDate(date)).toBe('2020-12-25T00:00:00Z');
    });

    it('handles end of day correctly', () => {
      const date = new Date('2020-12-25T23:59:59Z');
      expect(getUtcStringDate(date)).toBe('2020-12-25T23:59:59Z');
    });

    it('handles a date at the start of the year', () => {
      const date = new Date('2023-01-01T00:00:00Z');
      expect(getUtcStringDate(date)).toBe('2023-01-01T00:00:00Z');
    });

    it('handles a date at the end of the year', () => {
      const date = new Date('2023-12-31T23:59:59Z');
      expect(getUtcStringDate(date)).toBe('2023-12-31T23:59:59Z');
    });
  });

  describe('without arguments (uses current date)', () => {
    it('returns the current system date in UTC format', () => {
      mockDate.set({ isoDate: '2023-06-15T10:30:00Z' });
      expect(getUtcStringDate()).toBe('2023-06-15T10:30:00Z');
    });

    it('returns a different date when system time is changed', () => {
      mockDate.set({ isoDate: '2019-03-05T14:08:07Z' });
      expect(getUtcStringDate()).toBe('2019-03-05T14:08:07Z');
    });
  });

  describe('with different time zones', () => {
    it('returns UTC string when system is in a positive offset timezone', () => {
      mockDate.set({ offset: 330 }); // UTC+5:30 (India)
      const date = new Date('2023-01-15T18:30:00Z');
      expect(getUtcStringDate(date)).toBe('2023-01-15T18:30:00Z');
    });

    it('returns UTC string when system is in a negative offset timezone', () => {
      mockDate.set({ offset: -300 }); // UTC-5 (EST)
      const date = new Date('2023-07-04T12:00:00Z');
      expect(getUtcStringDate(date)).toBe('2023-07-04T12:00:00Z');
    });

    it('returns correct UTC when local date is the next day due to timezone', () => {
      mockDate.set({ offset: 540 }); // UTC+9 (Japan)
      const date = new Date('2023-01-15T23:00:00Z');
      expect(getUtcStringDate(date)).toBe('2023-01-15T23:00:00Z');
    });

    it('returns correct UTC for current date in a non-UTC timezone', () => {
      mockDate.set({ offset: 60, isoDate: '2023-03-20T09:00:00Z' }); // UTC+1 (CET)
      expect(getUtcStringDate()).toBe('2023-03-20T09:00:00Z');
    });
  });

  describe('invalid date handling', () => {
    it('throws an error when given an invalid date object', () => {
      const invalidDate = new Date('not-a-date');
      expect(() => getUtcStringDate(invalidDate)).toThrow('Invalid date');
    });

    it('throws an error when given a date created from NaN', () => {
      const invalidDate = new Date(NaN);
      expect(() => getUtcStringDate(invalidDate)).toThrow('Invalid date');
    });
  });

  describe('edge cases', () => {
    it('handles leap year date correctly', () => {
      const date = new Date('2024-02-29T12:00:00Z');
      expect(getUtcStringDate(date)).toBe('2024-02-29T12:00:00Z');
    });

    it('handles epoch date (Unix timestamp 0)', () => {
      const date = new Date(0);
      expect(getUtcStringDate(date)).toBe('1970-01-01T00:00:00Z');
    });

    it('pads single-digit months and days with leading zeros', () => {
      const date = new Date('2023-03-05T01:02:03Z');
      expect(getUtcStringDate(date)).toBe('2023-03-05T01:02:03Z');
    });

    it('handles date constructed from a timestamp', () => {
      const date = new Date(1672531200000); // 2023-01-01T00:00:00Z
      expect(getUtcStringDate(date)).toBe('2023-01-01T00:00:00Z');
    });
  });
});
