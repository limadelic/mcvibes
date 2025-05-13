import cmd from '../helpers/cmd.js';

const changes = () => {
  const changed = cmd('git diff --name-only');
  const staged = cmd(
    'git diff --staged --name-only'
  );
  const untracked = cmd(
    'git ls-files --others --exclude-standard'
  );
  const deleted = cmd('git ls-files --deleted');

  return {
    changed,
    staged,
    untracked,
    deleted,
    all: [
      ...changed,
      ...staged,
      ...untracked,
      ...deleted,
    ],
    total:
      changed.length +
      staged.length +
      untracked.length +
      deleted.length,
  };
};

export const checkLimit = (
  fileCount,
  comment
) => {
  const files = changes();
  const { total } = files;

  if (total > 2 && fileCount != total) {
    return {
      error: `❌ Error: Too many files changed (${total}). Maximum allowed: 2`,
      hint: `To continue, run: npm run tcr "${comment}" ${total}`,
    };
  }

  return { files };
};

export const status = () => {
  const files = changes();

  const list = [
    ...files.changed,
    ...files.staged,
  ].join('\n');

  const untracked =
    files.untracked.length > 0
      ? '\nNew files:\n' +
        files.untracked.join('\n')
      : '';

  const deleted =
    files.deleted.length > 0
      ? '\nDeleted files:\n' +
        files.deleted.join('\n')
      : '';

  return `Files changed:\n\n${list}${untracked}${deleted}`;
};
