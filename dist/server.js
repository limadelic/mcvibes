"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const { McpServer } = require('@modelcontextprotocol/sdk');
const app = (0, express_1.default)();
app.use(express_1.default.json());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, { cors: { origin: '*' } });
io.on('connection', socket => socket.on('tcr:instructions', () => socket.emit('tcr:instructions:response', { message: 'now i know tcr' })));
app.get('/', (_, res) => res.send('mcvibes'));
const mcpServer = new McpServer({
    name: 'mcvibes',
    version: '0.2.0'
});
mcpServer.setToolHandler('run_tcr', {}, async () => {
    return {
        content: [{ type: 'text', text: 'now i know tcr' }]
    };
});
mcpServer.listen(httpServer, { path: '/mcp' });
httpServer.listen(3000, () => console.error('mcvibes server running on port 3000'));
