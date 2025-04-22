"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)('http://localhost:3000');
// Get the user command (e.g., from process.argv)
const userInstruction = process.argv.slice(2).join(' ');
socket.on('connect', () => {
    // Pass the user instruction to MCP
    socket.emit('tcr:instructions', { instruction: userInstruction });
});
const child_process_1 = require("child_process");
socket.on('tcr:instructions:response', (data) => {
    if (!data || !data.instruction) {
        console.error('Invalid instruction from MCP server');
        process.exit(1);
    }
    const instruction = data.instruction.trim();
    if (/^(say|print)\s+/i.test(instruction)) {
        // e.g., "say hello" or "print status"
        const message = instruction.replace(/^(say|print)\s+/i, '');
        console.log(message);
        process.exit(0);
    }
    else if (/^run\s+/i.test(instruction)) {
        // e.g., "run ls -la"
        const command = instruction.replace(/^run\s+/i, '');
        const child = (0, child_process_1.spawn)(command, { shell: true, stdio: 'inherit' });
        child.on('exit', code => process.exit(code !== null && code !== void 0 ? code : 0));
    }
    else {
        console.error('Unknown or unsupported instruction:', instruction);
        process.exit(1);
    }
});
socket.on('connect_error', () => process.exit(1));
