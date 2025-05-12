import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import sh from '../sh.js';

const __dirname = dirname(
  fileURLToPath(import.meta.url)
);

export const schema = {
  type: 'object',
  properties: {
    comment: { type: 'string' },
    fileCount: { type: 'number' },
  },
  required: ['comment'],
};

export const def = {
  name: 'tcr',
  description:
    'Run TCR (Test && Commit || Revert) on a project. ' +
    'Provide a commit message as the comment parameter. ' +
    'Automatically detects project type and runs appropriate tests. ' +
    'If tests pass, changes are committed. If tests fail, changes are reverted. ' +
    'Works with any project type without configuration.',
  inputSchema: schema,
};

export const run = async (input) => {
  const comment = input.comment;

  if (!comment) {
    return {
      content: [
        {
          type: 'text',
          text: '❌ Error: Commit message required in format verb:description\nExample: add:user authentication',
        },
      ],
    };
  }

  if (!/^[a-z]+:.+/.test(comment)) {
    return {
      content: [
        {
          type: 'text',
          text: '❌ Error: Message must be in format verb:description\nExample: add:user authentication',
        },
      ],
    };
  }

  const args = [comment];
  input.fileCount &&
    args.push(input.fileCount.toString());

  const output = sh('tcr/node', args);

  return {
    content: [{ type: 'text', text: output }],
  };
};
