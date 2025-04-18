/**
 * Matrix-inspired pill choice functionality
 * Red pill or Blue pill - determines agent behavior
 */
export enum PillChoice {
  RED = 'red',   // See how deep the rabbit hole goes
  BLUE = 'blue'  // Return to blissful ignorance
}

export class MatrixPath {
  private choice: PillChoice;
  
  constructor(choice: PillChoice = PillChoice.BLUE) {
    this.choice = choice;
  }
  
  /**
   * Take the pill and determine your path in the Matrix
   */
  takePill(choice: PillChoice): string {
    this.choice = choice;
    
    if (choice === PillChoice.RED) {
      return "You take the red pill—you stay in Wonderland, and I show you how deep the rabbit hole goes.";
    } else {
      return "You take the blue pill—the story ends, you wake up in your bed and believe whatever you want to believe.";
    }
  }
  
  /**
   * Get the current path in the Matrix
   */
  getCurrentPath(): string {
    return this.choice === PillChoice.RED 
      ? "Following the white rabbit..."
      : "Enjoying the simulation...";
  }
}
