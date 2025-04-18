"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTestAgent = runTestAgent;
const agentClient_1 = require("../utils/agentClient");
/**
 * Test Agent - Demonstrates an agent connecting to the MCP
 * and running TCR commands
 */
async function runTestAgent() {
    console.log('Initializing test agent...');
    // Initialize with a Matrix-inspired name
    const agent = new agentClient_1.AgentClient('http://localhost:3000', 'Neo', 'ai');
    try {
        // Connect to the Matrix (MCP Server)
        console.log('Connecting to the Matrix...');
        const connected = await agent.connect();
        if (connected) {
            console.log('Successfully connected to the Matrix.');
            // Run a series of TCR commands
            const commands = [
                { verb: 'add', description: 'matrix-perception-system' },
                { verb: 'fix', description: 'agent-detection-algorithm' },
                { verb: 'refactor', description: 'reality-bending-code' }
            ];
            // Run each command with a delay
            for (const cmd of commands) {
                console.log(`Running TCR: ${cmd.verb}:${cmd.description}`);
                // Simulate TCR success/failure (randomly for demo)
                const success = Math.random() > 0.3; // 70% success rate
                // Simulate the TCR process without actually running it
                await new Promise(resolve => setTimeout(resolve, 2000));
                // Report result to the MCP
                agent.socket.emit('tcr:result', {
                    agent: 'Neo',
                    success,
                    verb: cmd.verb,
                    description: cmd.description,
                    error: success ? null : 'Reality glitch detected'
                });
                console.log(`TCR ${cmd.verb}:${cmd.description} - ${success ? 'SUCCESS' : 'FAILURE'}`);
                // Wait between commands
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
            console.log('Test agent completed all TCR commands.');
            // Keep the connection open for a while
            await new Promise(resolve => setTimeout(resolve, 10000));
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
// Run the test agent if this file is executed directly
if (require.main === module) {
    runTestAgent().catch(console.error);
}
