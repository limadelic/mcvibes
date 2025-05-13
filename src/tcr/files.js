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

export const checkLimit = (
  fileCount,
  comment
) => {
  const total = _.sum(
    _.map(changes, (x) => x.length)
  );

  if (total > 2 && fileCount != total)
    return {
      error: `❌ Error: Too many files changed (${total}). Maximum allowed: 2`,
      hint: `To continue, run: npm run tcr "${comment}" ${total}`,
    };

  return { files: changes };
};

export const status = () => {
  const list = [
    ...changes.changed,
    ...changes.staged,
  ].join('\n');

  const untracked =
    changes.untracked.length > 0
      ? '\nNew files:\n' +
        changes.untracked.join('\n')
      : '';

  const deleted =
    changes.deleted.length > 0
      ? '\nDeleted files:\n' +
        changes.deleted.join('\n')
      : '';

  return `Files changed:\n\n${list}${untracked}${deleted}`;
};
