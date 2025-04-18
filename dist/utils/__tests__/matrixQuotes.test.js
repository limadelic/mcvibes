"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matrixQuotes_1 = require("../matrixQuotes");
describe('MatrixQuotes', () => {
    test('should have at least 5 quotes', () => {
        expect(matrixQuotes_1.MatrixQuotes.length).toBeGreaterThanOrEqual(5);
    });
    test('should include the famous "I know kung fu" quote', () => {
        expect(matrixQuotes_1.MatrixQuotes).toContain("I know kung fu.");
    });
    test('should include the "There is no spoon" quote', () => {
        expect(matrixQuotes_1.MatrixQuotes).toContain("There is no spoon.");
    });
    test('all quotes should be strings', () => {
        matrixQuotes_1.MatrixQuotes.forEach(quote => {
            expect(typeof quote).toBe('string');
        });
    });
});
