import {
  changed,
  staged,
  untracked,
} from '../helpers/git.js';

const files = () => [
  ...changed(),
  ...staged(),
  ...untracked(),
];

export const total = () => files().length;

export const status = () => `
Files changed:

${files().join('\n')}

`;
