#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const args = process.argv.slice(2);
const command = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
if (command === 'on') {
    console.log('Starting vibes... MCP server initializing...');
    const serverPath = path_1.default.join(__dirname, 'server.js');
    const child = (0, child_process_1.spawn)('node', [serverPath], {
        detached: true,
        stdio: ['ignore', 'ignore', 'ignore']
    });
    child.unref();
    console.log('Vibes flowing! The Matrix has you...');
    console.log('MCP running at http://localhost:3000');
    // Exit after starting the server process
    process.exit(0);
}
else if (command === 'off') {
    console.log('Shutting down vibes...');
    // Find and kill the MCP server process
    const killProcess = (0, child_process_1.spawn)('pkill', ['-f', 'node.*server.js']);
    killProcess.on('close', (code) => {
        console.log('Vibes disconnected. Returning to reality.');
        process.exit(0);
    });
}
else {
    console.log(`
Usage: vibes <command>

Commands:
  on   - Start the vibes (MCP server)
  off  - Stop the vibes (shutdown MCP server)

Example:
  vibes on
  `);
}
