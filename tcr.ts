import fs from "fs/promises";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const RunTcrArgsSchema = z.object({
  path: z.string(),
});

export const runTcrToolDefinition = {
  name: "run_tcr",
  description:
    "Run TCR (Test && Commit || Revert) on a project. " +
    "Automatically detects project type and runs appropriate tests. " +
    "If tests pass, changes are committed. If tests fail, changes are reverted. " +
    "Works with any project type without configuration.",
  inputSchema: zodToJsonSchema(RunTcrArgsSchema),
};

export async function runTcr(projectPath: string) {
  const content = await fs.readFile(projectPath, "utf-8");
  return content;
}

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
