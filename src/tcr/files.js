import {
  changed,
  staged,
  untracked,
  deleted,
} from '../helpers/git.js';

const list = () =>
  [...changed(), ...staged()].join('\n');

const section = (title, files) =>
  files.length > 0
    ? `\n${title}:\n${files.join('\n')}`
    : '';

const added = () =>
  section('New files', untracked());

const removed = () =>
  section('Deleted files', deleted());

export const total = () =>
  changed().length +
  staged().length +
  untracked().length +
  deleted().length;

export const status = () =>
  `\nFiles changed:\n\n${list()}${added()}${removed()}\n`;
