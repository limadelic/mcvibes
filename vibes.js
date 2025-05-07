#!/usr/bin/env node

import * as tcr from './tcr.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'mcvibes',
    version: '1.0.0',
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
    tcr.run(request.params.arguments)
);

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MC Vibes in da houze');
}

runServer();
