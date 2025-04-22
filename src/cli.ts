#!/usr/bin/env node
import { spawn } from 'child_process'

const name = 'mcvibes'
const server = __dirname + '/server.js'

function on() {
  spawn('node', [`--title=${name}`, server], {
    detached: true, stdio: 'ignore'
  }).unref()
}

function off() {
  spawn('pkill', ['-f', name])
}

const commands = { on, off }

const cmd = process.argv[2]
commands[cmd]?.()
