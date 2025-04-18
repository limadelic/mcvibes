"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixPath = exports.PillChoice = void 0;
/**
 * Matrix-inspired pill choice functionality
 * Red pill or Blue pill - determines agent behavior
 */
var PillChoice;
(function (PillChoice) {
    PillChoice["RED"] = "red";
    PillChoice["BLUE"] = "blue"; // Return to blissful ignorance
})(PillChoice || (exports.PillChoice = PillChoice = {}));
class MatrixPath {
    constructor(choice = PillChoice.BLUE) {
        this.choice = choice;
    }
    /**
     * Take the pill and determine your path in the Matrix
     */
    takePill(choice) {
        this.choice = choice;
        if (choice === PillChoice.RED) {
            return "You take the red pill—you stay in Wonderland, and I show you how deep the rabbit hole goes.";
        }
        else {
            return "You take the blue pill—the story ends, you wake up in your bed and believe whatever you want to believe.";
        }
    }
    /**
     * Get the current path in the Matrix
     */
    getCurrentPath() {
        return this.choice === PillChoice.RED
            ? "Following the white rabbit..."
            : "Enjoying the simulation...";
    }
}
exports.MatrixPath = MatrixPath;
