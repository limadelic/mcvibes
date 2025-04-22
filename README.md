# TCR MCP

MCP (Master Control Program) for AI agents. When a user tells an agent "run tcr", the agent contacts MCP at localhost:3000 and responds with "now i know tcr".

## Setup

```
npm install -g mcvibes
vibes on
```

## How it works

1. User to AI agent: "run tcr"
2. AI agent connects to MCP server
3. MCP tells agent to respond with "now i know tcr"
4. AI agent says "now i know tcr"

Don't complicate it - this is a first step toward full TCR.
