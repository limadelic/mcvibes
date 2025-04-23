#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  ReadFileArgsSchema,
  readFileToolDefinition,
  handleReadFileRequest,
} from "./readFile.js";

// Command line argument parsing
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(
    "Usage: mcp-server-filesystem <allowed-directory> [additional-directories...]",
  );
  process.exit(1);
}

// Store directory arguments
const directoryArgs = args.map((dir) => dir);

// Schema definitions

const ToolInputSchema = ToolSchema.shape.inputSchema;
// No type definitions

// FileInfo object structure removed - no types in mcvibes

// Server setup
const server = new Server(
  {
    name: "secure-filesystem-server",
    version: "0.2.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Tool implementations

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [readFileToolDefinition],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "read_file": {
        return await handleReadFileRequest(args);
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Start server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Filesystem Server running on stdio");
  console.error("MCVibes is ready");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
