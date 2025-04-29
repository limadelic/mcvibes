# MCP Client Quick Guide

## What is MCP?

Model Context Protocol (MCP) is a standardized way for AI applications to connect to external tools, resources, and prompts.

## Basic Client Requirements

1. **Connect to servers** using either:

   - STDIO (standard input/output): Send JSON messages to stdin, receive from stdout
   - SSE (Server-Sent Events): HTTP connection with event streaming

2. **Handle basic protocol messages**:
   - Requests: `{"id":"123","method":"method/name","params":{...}}`
   - Responses: `{"id":"123","result":{...}}`
   - Notifications: `{"method":"notification/name","params":{...}}`

## Core MCP Requests

1. **List available tools**:

   ```json
   { "id": "tool-list-1", "method": "tools/list" }
   ```

2. **Call a tool**:
   ```json
   {"id":"call-1","method":"tools/call","params":{"name":"tool_name","arguments":{...}}}
   ```

## Server Connectivity

To connect to a server, you need:

1. The server's transport method (STDIO or SSE)
2. For STDIO: access to the process stdin/stdout
3. For SSE: the server's URL endpoint

## Communication Pattern

1. Send a request with a unique ID
2. Wait for a response with the matching ID
3. Process any notifications that may come in between

## Tool List Response Example

```json
{
  "id": "tool-list-1",
  "result": {
    "tools": [
      {
        "name": "example_tool",
        "description": "An example tool",
        "parameters": {
          "type": "object",
          "properties": {
            "param1": { "type": "string" },
            "param2": { "type": "number" }
          },
          "required": ["param1"]
        }
      }
    ]
  }
}
```

## Tool Call Example

```json
{
  "id": "call-123",
  "method": "tools/call",
  "params": {
    "name": "example_tool",
    "arguments": { "param1": "value1", "param2": 42 }
  }
}
```

## Tool Call Response Example

```json
{
  "id": "call-123",
  "result": {
    "content": [{ "type": "text", "text": "Result of the tool execution" }]
  }
}
```
