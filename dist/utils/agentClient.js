"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentClient = void 0;
const socket_io_client_1 = require("socket.io-client");
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
/**
 * Client for AI agents to connect to the TCR MCP server
 */
class AgentClient {
    constructor(serverUrl = 'http://localhost:3000', name = 'Neo', type = 'ai') {
        this.serverUrl = serverUrl;
        this.agent = { name, type };
        this.socket = (0, socket_io_client_1.io)(serverUrl);
        this.setupEventHandlers();
    }
    /**
     * Connect to the MCP server
     */
    async connect() {
        var _a;
        try {
            // Register with the server
            const response = await axios_1.default.post(`${this.serverUrl}/api/agents`, this.agent);
            if (response.data.success) {
                this.agent.id = (_a = response.data.agent) === null || _a === void 0 ? void 0 : _a.id;
                console.log(`Connected to the Matrix as ${this.agent.name}`);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Failed to connect to the Matrix:', error);
            return false;
        }
    }
    /**
     * Run a TCR process
     */
    async runTcr(verb, description) {
        try {
            // Notify MCP that we're starting TCR
            this.socket.emit('tcr:start', {
                agent: this.agent.name,
                verb,
                description
            });
            console.log(`Running TCR: ${verb}:${description}`);
            // Run the actual TCR command
            try {
                await execAsync(`npm run tcr ${verb}:${description}`);
                // If we get here, TCR passed
                this.socket.emit('tcr:result', {
                    agent: this.agent.name,
                    success: true,
                    verb,
                    description
                });
                return true;
            }
            catch (error) {
                // TCR failed
                this.socket.emit('tcr:result', {
                    agent: this.agent.name,
                    success: false,
                    verb,
                    description,
                    error: error.message
                });
                return false;
            }
        }
        catch (error) {
            console.error('Error during TCR process:', error);
            return false;
        }
    }
    /**
     * Disconnect from the MCP server
     */
    disconnect() {
        this.socket.disconnect();
        console.log('Disconnected from the Matrix');
    }
    setupEventHandlers() {
        this.socket.on('connect', () => {
            console.log('Connected to the Matrix. The Matrix has you...');
        });
        this.socket.on('disconnect', () => {
            console.log('Disconnected from the Matrix');
        });
        // Handle custom events from the server
        this.socket.on('control:reset', () => {
            console.log('Reset command received from the Architect');
            // Handle reset logic here
        });
    }
}
exports.AgentClient = AgentClient;
