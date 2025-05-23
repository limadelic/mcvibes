import {
  changed,
  staged,
  untracked,
} from '../helpers/git.js';

const section = (title, files) =>
  files.length > 0
    ? `\n${title}:\n${files.join('\n')}`
    : '';

const list = () =>
  section('Files changed:', [
    ...changed(),
    ...staged(),
  ]);

const added = () =>
  section('New files', untracked());

export const total = () =>
  changed().length +
  staged().length +
  untracked().length;

export const status = () => list() + added();
