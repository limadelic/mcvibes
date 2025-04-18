# TCR MCP Server

Master Control Program for AI agents running through the Test && Commit || Revert (TCR) process.

## What is TCR?

TCR (Test && Commit || Revert) is a programming workflow where:

1. You make a change to the code
2. Tests are run automatically
3. If the tests pass, changes are committed
4. If the tests fail, all changes are reverted

This creates a tight feedback loop and ensures your codebase always remains in a working state.

## What is the MCP Server?

The MCP Server provides a central hub for AI agents to connect to and run through the TCR process. It:

1. Tracks agent status and history
2. Provides real-time feedback via a dashboard
3. Coordinates TCR operations across multiple agents
4. Logs all TCR activity

## Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start

# Development mode
npm run dev
```

## Using TCR

Run the TCR process with:

```bash
npm run tcr <verb>:<description>
```

Examples:
- `npm run tcr add:new-agent-feature`
- `npm run tcr fix:agent-connection-issue`
- `npm run tcr refactor:improve-error-handling`

## Dashboard

The MCP dashboard is available at http://localhost:3000 when the server is running.
