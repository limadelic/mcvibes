import { exec } from 'child_process';
import { promisify } from 'util';
import simpleGit from 'simple-git';
import { io } from 'socket.io-client';

const execAsync = promisify(exec);
const git = simpleGit();

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
const socket = io('http://localhost:3000');
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
function reportResult(success: boolean, error?: any) {
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
    } else {
      // 3. If tests fail, revert changes
      console.log('Tests failed! Reverting changes...');
      await revert();
      reportResult(false, testResult.error);
      console.log('Changes reverted. Try again after fixing your code.');
    }
    
    // Wait a moment for socket to send before exiting, but not too long
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Socket communication completed or timed out');
    // Force socket disconnect to prevent hanging
    socket.disconnect();
    
  } catch (error) {
    reportResult(false, error);
    console.error('TCR process failed:', error);
    
    // Wait a moment for socket to send before exiting, but not too long
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Socket communication completed or timed out');
    // Force socket disconnect to prevent hanging
    socket.disconnect();
    process.exit(1);
  }
}

// Run the tests
async function runTests() {
  try {
    await execAsync('npm test');
    return { success: true };
  } catch (error) {
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
