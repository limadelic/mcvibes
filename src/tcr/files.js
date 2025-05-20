import {
  changed,
  staged,
  untracked,
  deleted,
} from '../helpers/git.js';

const changes = () => ({
  changed: changed(),
  staged: staged(),
  untracked: untracked(),
  deleted: deleted(),
});

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

export const total = () => {
  const files = changes();
  return Object.values(files).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
};

export const status = () =>
  `\nFiles changed:\n\n${list()}${added()}${removed()}\n`;
