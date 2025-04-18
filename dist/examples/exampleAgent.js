"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runExampleAgent = runExampleAgent;
const agentClient_1 = require("../utils/agentClient");
// Create a new Agent
async function runExampleAgent() {
    console.log('Starting Agent...');
    // Initialize with a Matrix-inspired name
    const agent = new agentClient_1.AgentClient('http://localhost:3000', 'Morpheus', 'ai');
    try {
        // Connect to the Matrix (MCP Server)
        const connected = await agent.connect();
        if (connected) {
            console.log('Agent connected to the Matrix successfully.');
            // Simulate some TCR runs
            console.log('Running first TCR...');
            const result1 = await agent.runTcr('add', 'agent-detection-system');
            console.log(`TCR result: ${result1 ? 'Success' : 'Failure'}`);
            // Wait a bit
            await new Promise(resolve => setTimeout(resolve, 3000));
            console.log('Running second TCR...');
            const result2 = await agent.runTcr('fix', 'sentinel-behavior');
            console.log(`TCR result: ${result2 ? 'Success' : 'Failure'}`);
            // Keep the agent running for a while
            console.log('Agent is now monitoring the Matrix...');
            await new Promise(resolve => setTimeout(resolve, 30000));
            // Disconnect
            agent.disconnect();
        }
        else {
            console.error('Failed to connect to the Matrix.');
        }
    }
    catch (error) {
        console.error('Agent error:', error);
    }
}
// Start the agent if this file is run directly
if (require.main === module) {
    runExampleAgent().catch(console.error);
}
