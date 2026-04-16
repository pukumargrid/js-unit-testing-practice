import { validateUserName } from 'tasks/task1/index';
import { fetchIsUserNameAvailable } from 'tasks/task1/fetchIsUserNameValid';

jest.mock('tasks/task1/fetchIsUserNameValid', () => ({
  fetchIsUserNameAvailable: jest.fn(),
}));

const mockedFetch = jest.mocked(fetchIsUserNameAvailable);

describe('validateUserName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('returns false for invalid user names without making requests', () => {
    afterEach(() => {
      expect(mockedFetch).not.toHaveBeenCalled();
    });

    it('returns false if name has length less than 3 symbols', async () => {
      expect(await validateUserName('ab')).toBe(false);
    });

    it('returns false for a single character name', async () => {
      expect(await validateUserName('a')).toBe(false);
    });

    it('returns false for an empty string', async () => {
      expect(await validateUserName('')).toBe(false);
    });

    it('returns false if name contains spaces', async () => {
      expect(await validateUserName('abc def')).toBe(false);
    });

    it('returns false if name contains special characters', async () => {
      expect(await validateUserName('abc!')).toBe(false);
    });

    it('returns false if name contains underscores', async () => {
      expect(await validateUserName('abc_def')).toBe(false);
    });

    it('returns false if name starts with a number', async () => {
      expect(await validateUserName('1abc')).toBe(false);
    });

    it('returns false if name is only digits', async () => {
      expect(await validateUserName('123')).toBe(false);
    });
  });

  describe('calls fetchIsUserNameAvailable for valid names', () => {
    it('returns true if name is valid and available', async () => {
      mockedFetch.mockResolvedValue(true);
      expect(await validateUserName('validName')).toBe(true);
      expect(mockedFetch).toHaveBeenCalledWith('validName');
    });

    it('returns false if name is valid but not available', async () => {
      mockedFetch.mockResolvedValue(false);
      expect(await validateUserName('takenName')).toBe(false);
    });

    it('returns false if fetchIsUserNameAvailable throws an error', async () => {
      mockedFetch.mockImplementation(() => {
        throw new Error('Network error');
      });
      expect(await validateUserName('validName')).toBe(false);
    });

    it('accepts a name with exactly 3 alphanumeric characters', async () => {
      mockedFetch.mockResolvedValue(true);
      expect(await validateUserName('abc')).toBe(true);
    });

    it('accepts a name with mixed letters and digits (not starting with digit)', async () => {
      mockedFetch.mockResolvedValue(true);
      expect(await validateUserName('user123')).toBe(true);
    });

    it('passes the correct username to fetchIsUserNameAvailable', async () => {
      mockedFetch.mockResolvedValue(true);
      await validateUserName('testUser');
      expect(mockedFetch).toHaveBeenCalledTimes(1);
      expect(mockedFetch).toHaveBeenCalledWith('testUser');
    });
  });
});
