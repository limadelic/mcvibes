#!/usr/bin/env node
"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const name = 'mcvibes';
const server = __dirname + '/server.js';
function on() {
    (0, child_process_1.spawn)('node', [`--title=${name}`, server], {
        detached: true, stdio: 'ignore'
    }).unref();
}
function off() {
    (0, child_process_1.spawn)('pkill', ['-f', name]);
}
const commands = { on, off };
const cmd = process.argv[2];
(_a = commands[cmd]) === null || _a === void 0 ? void 0 : _a.call(commands);
