import npm from '../helpers/npm.js';
import git from '../helpers/git.js';
import { valid, error } from './validation.js';
import { status } from './files.js';
import { format } from './format.js';

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

const test = () => npm.test().length === 0;

const commit = (comment) => {
  git.add();
  git.commit(comment);
  return `✅ Tests passed - committed: ${comment}`;
};

const revert = () => {
  git.reset();
  git.clean();
  return '❌ Tests failed - changes reverted';
};

const tcr = ({ comment }) =>
  (test() && commit(comment)) || revert();

export const run = async (params) => {
  if (!valid(params)) return error(params);

  format();

  return status() + tcr(params);
};
