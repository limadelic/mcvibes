import sh from '../helpers/sh.js';
import { bad, errors } from './validate.js';
import { text } from '../helpers/response.js';

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
    'If tests pass, changes are committed. If tests fail, changes are reverted. Works with any project type without configuration.',
  inputSchema: schema,
};

export const run = async (input) => {
  if (bad(input)) return text(errors(input));

  const args = [input.comment];
  input.fileCount &&
    args.push(input.fileCount.toString());

  const output = sh('tcr/node', args);

  return text(output);
};
