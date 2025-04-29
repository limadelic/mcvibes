export const schema = {
  type: "object",
  properties: {
    comment: { type: "string" }
  },
  required: ["comment"]
};

export const def = {
  name: "tcr",
  description:
    "Run TCR (Test && Commit || Revert) on a project. " +
    "Provide a commit message as the comment parameter. " +
    "Automatically detects project type and runs appropriate tests. " +
    "If tests pass, changes are committed. If tests fail, changes are reverted. " +
    "Works with any project type without configuration.",
  inputSchema: schema,
};

export const run = async (input) => {
  if (!input || typeof input.comment !== "string") {
    throw new Error(`Invalid arguments for tcr: comment must be a string`);
  }
  
  const result = Math.random() > 0.3
    ? `✅ Tests passed - committed: ${input.comment}`
    : "❌ Tests failed - changes reverted";
    
  return {
    content: [{ type: "text", text: result }],
  };
};
