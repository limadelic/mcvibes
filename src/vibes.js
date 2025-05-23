#!/usr/bin/env node

import * as tcr from './tcr/tcr.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import pkg from '../package.json' with { type: 'json' };
import { text } from './helpers/response.js';

const server = new Server(
  {
    name: pkg.name,
    version: pkg.version,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(
  ListToolsRequestSchema,
  async () => ({ tools: [tcr.def] })
);

server.setRequestHandler(
  CallToolRequestSchema,
  async (request) =>
    text(await tcr.run(request.params.arguments))
);

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run();
