import { PillChoice, MatrixPath } from '../pillChoice';

describe('MatrixPath', () => {
  let matrixPath: MatrixPath;

  beforeEach(() => {
    matrixPath = new MatrixPath();
  });

  test('should default to the blue pill', () => {
    expect(matrixPath.getCurrentPath()).toBe("Enjoying the simulation...");
  });

  test('should take the red pill and return correct message', () => {
    const message = matrixPath.takePill(PillChoice.RED);
    expect(message).toContain("red pill");
    expect(message).toContain("how deep the rabbit hole goes");
    expect(matrixPath.getCurrentPath()).toBe("Following the white rabbit...");
  });

  test('should take the blue pill and return correct message', () => {
    const message = matrixPath.takePill(PillChoice.BLUE);
    expect(message).toContain("blue pill");
    expect(message).toContain("believe whatever you want to believe");
    expect(matrixPath.getCurrentPath()).toBe("Enjoying the simulation...");
  });
});
