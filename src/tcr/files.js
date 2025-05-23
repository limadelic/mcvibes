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

export const status = () =>
  total() > 0 &&
  `
Files changed:

${files().join('\n')}

`;
