import sh from '../helpers/sh.js';
import { bad, errors } from './validate.js';
import { text } from '../helpers/response.js';
import { args } from './args.js';

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

export const run = async (params) => {
  if (bad(params)) return text(errors(params));

  const output = sh('tcr/node', args(params));

  return text(output);
};
