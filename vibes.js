#!/usr/bin/env node

import * as tcr from './tcr.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

async function run() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  const sseHandler = (req, res) => {
    // Handle SSE request
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    
    const port = process.argv[2] ? parseInt(process.argv[2]) : 3000;
    // Format exactly what Elixir expects
    res.write('event: endpoint\n');
    res.write(`data: http://localhost:${port}/mcp\n\n`);
    
    // Keep connection alive
    const keepAliveInterval = setInterval(() => {
      res.write(': keep-alive\n\n');
    }, 30000);
    
    // Clean up when client disconnects
    req.on('close', () => {
      clearInterval(keepAliveInterval);
    });
  };
  
  // Handle both root and /sse path
  app.get('/', sseHandler);
  app.get('/sse', sseHandler);

  app.post('/mcp', (req, res) => {
    const msg = req.body;
    
    const handlers = {
      'initialize': () => ({
        jsonrpc: '2.0',
        id: msg.id,
        result: {
          serverInfo: { name: 'mcvibes', version: '1.0.0' },
          capabilities: { tools: true }
        }
      }),
      
      'tools/list': () => ({
        jsonrpc: '2.0',
        id: msg.id,
        result: { tools: [tcr.def] }
      }),
      
      'tools/call': async () => {
        const result = await tcr.run(msg.params.arguments);
        return { 
          jsonrpc: '2.0',
          id: msg.id, 
          result 
        };
      }
    };
    
    const handler = handlers[msg.method] || (() => ({
      jsonrpc: '2.0',
      id: msg.id,
      error: { code: -32601, message: `Method '${msg.method}' not found` }
    }));
    
    Promise.resolve(handler()).then(result => res.json(result));
  });

  const port = process.argv[2] ? parseInt(process.argv[2]) : 3000;

  app.listen(port, () => {
    console.log(`MCP server running on port ${port}`);
  });

  process.on('SIGINT', () => {
    process.exit(0);
  });
}

run();
