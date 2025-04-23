import fs from "fs/promises";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Schema definition for read_file
export const ReadFileArgsSchema = z.object({
  path: z.string(),
});

// Tool definition for read_file
export const readFileToolDefinition = {
  name: "read_file",
  description:
    "Read the complete contents of a file from the file system. " +
    "Handles various text encodings and provides detailed error messages " +
    "if the file cannot be read. Use this tool when you need to examine " +
    "the contents of a single file. Only works within allowed directories.",
  inputSchema: zodToJsonSchema(ReadFileArgsSchema),
};

// Read file implementation
export async function readFile(
  filePath: string,
  validatePath: (path: string) => Promise<string>,
) {
  const validPath = await validatePath(filePath);
  const content = await fs.readFile(validPath, "utf-8");
  return content;
}

// Handler for read_file tool requests
export async function handleReadFileRequest(
  args: unknown,
  validatePath: (path: string) => Promise<string>,
) {
  const parsed = ReadFileArgsSchema.safeParse(args);
  if (!parsed.success) {
    throw new Error(`Invalid arguments for read_file: ${parsed.error}`);
  }
  const content = await readFile(parsed.data.path, validatePath);
  return {
    content: [{ type: "text", text: content }],
  };
}
