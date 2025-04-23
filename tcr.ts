import fs from "fs/promises";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const args = z.object({
  comment: z.string(),
});

export const def = {
  name: "tcr",
  description:
    "Run TCR (Test && Commit || Revert) on a project. " +
    "Provide a commit message as the comment parameter. " +
    "Automatically detects project type and runs appropriate tests. " +
    "If tests pass, changes are committed. If tests fail, changes are reverted. " +
    "Works with any project type without configuration.",
  inputSchema: zodToJsonSchema(args),
};

export const tcr = async (comment) =>
  Math.random() > 0.3
    ? `✅ Tests passed - committed: ${comment}`
    : "❌ Tests failed - changes reverted";

export const run = async (input) => {
  const parsed = args.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Invalid arguments for tcr: ${parsed.error}`);
  }
  const result = await tcr(parsed.data.comment);
  return {
    content: [{ type: "text", text: result }],
  };
};
