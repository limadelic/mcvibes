import {
  changed,
  staged,
  untracked,
} from '../helpers/git.js';

export const total = () =>
  changed().length +
  staged().length +
  untracked().length;

export const status = () => `
Files changed:

${changed().join('\n')}
${staged().join('\n')}
${untracked().join(' (*)\n')}
`;
