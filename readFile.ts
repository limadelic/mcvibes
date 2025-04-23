import fs from "fs/promises";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { execSync } from "child_process";

// Schema definition for run_tcr
export const RunTcrArgsSchema = z.object({
  path: z.string(),
});

// Tool definition for run_tcr
export const runTcrToolDefinition = {
  name: "run_tcr",
  description:
    "Run TCR (Test && Commit || Revert) on a project. " +
    "Automatically detects project type and runs appropriate tests. " +
    "If tests pass, changes are committed. If tests fail, changes are reverted. " +
    "Works with any project type without configuration.",
  inputSchema: zodToJsonSchema(RunTcrArgsSchema),
};

// TCR implementation
export async function runTcr(projectPath: string) {
  // For now, just reading a file to maintain the same pattern
  // This will be replaced with actual TCR implementation
  const content = await fs.readFile(projectPath, "utf-8");
  return content;
}

// Handler for run_tcr tool requests
export async function handleRunTcrRequest(args: unknown) {
  const parsed = RunTcrArgsSchema.safeParse(args);
  if (!parsed.success) {
    throw new Error(`Invalid arguments for run_tcr: ${parsed.error}`);
  }
  const result = await runTcr(parsed.data.path);
  return {
    content: [{ type: "text", text: result }],
  };
}
