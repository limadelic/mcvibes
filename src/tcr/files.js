import {
  changed,
  staged,
  untracked,
  deleted,
} from '../helpers/git.js';
import _ from 'lodash';

export const changes = {
  changed: changed(),
  staged: staged(),
  untracked: untracked(),
  deleted: deleted(),
};

const total = (x) =>
  _.sum(_.map(x, (arr) => arr.length));

export const checkLimit = (
  fileCount,
  comment
) => {
  const totalFiles = total(changes);

  if (totalFiles > 2 && fileCount != totalFiles)
    return {
      error: `❌ Error: Too many files changed (${totalFiles}). Maximum allowed: 2`,
      hint: `To continue, run: npm run tcr "${comment}" ${totalFiles}`,
    };

  return { files: changes };
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
  `\nFiles changed:\n\n${list()}${added()}${removed()}\n\n`;
