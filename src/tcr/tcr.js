import { spawnSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

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
  const tcrPath = join(__dirname, 'node.sh');
  const args = [tcrPath, input.comment];

  input.fileCount &&
    args.push(input.fileCount.toString());

  const result = spawnSync('bash', args, {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  return {
    content: [
      { type: 'text', text: result.stdout },
    ],
  };
};
