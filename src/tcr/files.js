import {
  changed,
  staged,
  untracked,
  deleted,
} from '../helpers/git.js';

export const changes = {
  changed: changed(),
  staged: staged(),
  untracked: untracked(),
  deleted: deleted(),
};

const list = () =>
  [...changes.changed, ...changes.staged].join(
    '\n'
  );

const added = () =>
  changes.untracked.length > 0
    ? '\nNew files:\n' +
      changes.untracked.join('\n')
    : '';

const removed = () =>
  changes.deleted.length > 0
    ? '\nDeleted files:\n' +
      changes.deleted.join('\n')
    : '';

export const status = () =>
  `\nFiles changed:\n\n${list()}${added()}${removed()}\n`;
