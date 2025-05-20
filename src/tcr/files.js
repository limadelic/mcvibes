import {
  changed,
  staged,
  untracked,
  deleted,
} from '../helpers/git.js';

export const changes = () => ({
  changed: changed(),
  staged: staged(),
  untracked: untracked(),
  deleted: deleted(),
});

const list = () => {
  const { changed, staged } = changes();
  return [...changed, ...staged].join('\n');
};

const added = () => {
  const { untracked } = changes();
  return untracked.length > 0
    ? '\nNew files:\n' + untracked.join('\n')
    : '';
};

const removed = () => {
  const { deleted } = changes();
  return deleted.length > 0
    ? '\nDeleted files:\n' + deleted.join('\n')
    : '';
};

export const status = () =>
  `\nFiles changed:\n\n${list()}${added()}${removed()}\n`;
