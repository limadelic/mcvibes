"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer);
const mcpResponse = {
    jsonrpc: '2.0',
    result: { instructions: [{ content: [{ type: 'text', text: 'now i know tcr' }] }] }
};
app.post('/mcp', express_1.default.json(), (req, res) => {
    res.json({ ...mcpResponse, id: req.body.id });
});
io.on('connection', socket => {
    socket.on('tcr:instructions', () => {
        socket.emit('tcr:instructions:response', { message: 'now i know tcr' });
    });
});
httpServer.listen(3000);
