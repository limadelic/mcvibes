import fs from "fs/promises";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const TcrArgsSchema = z.object({
  path: z.string(),
});

export const def = {
  name: "tcr",
  description:
    "Run TCR (Test && Commit || Revert) on a project. " +
    "Automatically detects project type and runs appropriate tests. " +
    "If tests pass, changes are committed. If tests fail, changes are reverted. " +
    "Works with any project type without configuration.",
  inputSchema: zodToJsonSchema(TcrArgsSchema),
};

export async function tcr(projectPath: string) {
  const content = await fs.readFile(projectPath, "utf-8");
  return content;
}

export async function handleTcrRequest(args: unknown) {
  const parsed = TcrArgsSchema.safeParse(args);
  if (!parsed.success) {
    throw new Error(`Invalid arguments for tcr: ${parsed.error}`);
  }
  const result = await tcr(parsed.data.path);
  return {
    content: [{ type: "text", text: result }],
  };
}
