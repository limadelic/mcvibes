import {
  changed,
  staged,
  untracked,
} from '../helpers/git.js';

const list = () =>
  [...changed(), ...staged()].join('\n');

const section = (title, files) =>
  files.length > 0
    ? `\n${title}:\n${files.join('\n')}`
    : '';

const added = () =>
  section('New files', untracked());

export const total = () =>
  changed().length +
  staged().length +
  untracked().length;

export const status = () =>
  `
Files changed:
${list()}
${added()}
`;
