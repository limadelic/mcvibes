import sh from '../helpers/sh.js';
import { valid, errors } from './validation.js';
import { text } from '../helpers/response.js';
import { args } from './args.js';
import { fileStatus } from './files.js';

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
  if (!valid.args(params))
    return text(errors.args(params));

  sh('tcr/node/format');

  if (!valid.files(params))
    return text(errors.files(params));

  const status = fileStatus();
  const output = sh(
    'tcr/node/test',
    args(params)
  );

  return text(status + output);
};
