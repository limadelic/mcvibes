"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
const simple_git_1 = __importDefault(require("simple-git"));
const socket_io_client_1 = require("socket.io-client");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const git = (0, simple_git_1.default)();
// Parse arguments - expecting format: <verb>:<description>
const args = process.argv.slice(2);
const tcrArg = args[0] || '';
if (!tcrArg.includes(':')) {
    console.error('Error: TCR command must be in format <verb>:<description>');
    process.exit(1);
}
const [verb, ...descriptionParts] = tcrArg.split(':');
const description = descriptionParts.join(':');
// Connect to MCP
const socket = (0, socket_io_client_1.io)('http://localhost:3000');
const agentName = 'Dude'; // Default agent name
// Report to MCP that TCR is starting
function reportStart() {
    socket.emit('tcr:start', {
        agent: agentName,
        verb,
        description
    });
}
// Report TCR result to MCP
function reportResult(success, error) {
    socket.emit('tcr:result', {
        agent: agentName,
        success,
        verb,
        description,
        error: error ? error.toString() : null
    });
}
// Main TCR process
async function runTcr() {
    try {
        console.log(`Starting TCR process: ${verb}:${description}`);
        // Report to MCP
        reportStart();
        // 1. Run tests
        console.log('Running tests...');
        const testResult = await runTests();
        if (testResult.success) {
            // 2. If tests pass, commit changes
            console.log('Tests passed! Committing changes...');
            await commit(verb, description);
            reportResult(true);
            console.log('TCR process completed successfully!');
        }
        else {
            // 3. If tests fail, revert changes
            console.log('Tests failed! Reverting changes...');
            await revert();
            reportResult(false, testResult.error);
            console.log('Changes reverted. Try again after fixing your code.');
        }
        // Wait a moment for socket to send before exiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    catch (error) {
        reportResult(false, error);
        console.error('TCR process failed:', error);
        // Wait a moment for socket to send before exiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        process.exit(1);
    }
}
// Run the tests
async function runTests() {
    try {
        await execAsync('npm test');
        return { success: true };
    }
    catch (error) {
        return { success: false, error };
    }
}
// Commit changes
async function commit(verb, description) {
    const commitMessage = `${verb}: ${description}`;
    await git.add('.');
    await git.commit(commitMessage);
    console.log(`Committed with message: "${commitMessage}"`);
}
// Revert changes
async function revert() {
    await git.reset(['--hard']);
}
// Execute TCR
runTcr();
