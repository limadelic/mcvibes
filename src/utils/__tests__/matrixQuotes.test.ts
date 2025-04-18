import { MatrixQuotes } from '../matrixQuotes';

describe('MatrixQuotes', () => {
  test('should have at least 5 quotes', () => {
    expect(MatrixQuotes.length).toBeGreaterThanOrEqual(5);
  });

  test('should include the famous "I know kung fu" quote', () => {
    expect(MatrixQuotes).toContain("I know kung fu.");
  });

  test('should include the "There is no spoon" quote', () => {
    expect(MatrixQuotes).toContain("There is no spoon.");
  });

  test('all quotes should be strings', () => {
    MatrixQuotes.forEach(quote => {
      expect(typeof quote).toBe('string');
    });
  });
});
