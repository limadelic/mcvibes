import { execSync } from 'child_process';

const countCommand = (cmd) =>
  parseInt(
    execSync(cmd, { encoding: 'utf8' }).trim(),
    10
  ) || 0;

const getChangedFiles = () => {
  // Get changed but unstaged files
  const changedFiles = execSync(
    'git diff --name-only',
    { encoding: 'utf8' }
  )
    .trim()
    .split('\n')
    .filter(Boolean);

  // Get staged files
  const stagedFiles = execSync(
    'git diff --staged --name-only',
    { encoding: 'utf8' }
  )
    .trim()
    .split('\n')
    .filter(Boolean);

  // Get new untracked files
  const untrackedFiles = execSync(
    'git ls-files --others --exclude-standard',
    { encoding: 'utf8' }
  )
    .trim()
    .split('\n')
    .filter(Boolean);

  // Get deleted files
  const deletedFiles = execSync(
    'git ls-files --deleted',
    { encoding: 'utf8' }
  )
    .trim()
    .split('\n')
    .filter(Boolean);

  return {
    changed: changedFiles,
    staged: stagedFiles,
    untracked: untrackedFiles,
    deleted: deletedFiles,
    all: [
      ...changedFiles,
      ...stagedFiles,
      ...untrackedFiles,
      ...deletedFiles,
    ],
    total:
      changedFiles.length +
      stagedFiles.length +
      untrackedFiles.length +
      deletedFiles.length,
  };
};

export const checkLimit = (
  fileCount,
  comment
) => {
  const files = getChangedFiles();
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
  const files = getChangedFiles();

  const changedFiles = [
    ...files.changed,
    ...files.staged,
  ];
  const fileList = changedFiles.join('\n');

  const newFiles =
    files.untracked.length > 0
      ? '\nNew files:\n' +
        files.untracked.join('\n')
      : '';

  const deletedFiles =
    files.deleted.length > 0
      ? '\nDeleted files:\n' +
        files.deleted.join('\n')
      : '';

  return `Files changed:\n\n${fileList}${newFiles}${deletedFiles}`;
};
