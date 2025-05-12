import { execSync } from 'child_process';

const countCommand = (cmd) =>
  parseInt(
    execSync(cmd, { encoding: 'utf8' }).trim(),
    10
  ) || 0;

const getChangedFiles = () => {
  const changedFiles = execSync(
    'git diff --name-only',
    { encoding: 'utf8' }
  )
    .trim()
    .split('\\n')
    .filter(Boolean);
  const stagedFiles = execSync(
    'git diff --staged --name-only',
    { encoding: 'utf8' }
  )
    .trim()
    .split('\\n')
    .filter(Boolean);
  const untrackedFiles = execSync(
    'git ls-files --others --exclude-standard',
    { encoding: 'utf8' }
  )
    .trim()
    .split('\\n')
    .filter(Boolean);

  return {
    changed: changedFiles,
    staged: stagedFiles,
    untracked: untrackedFiles,
    all: [
      ...changedFiles,
      ...stagedFiles,
      ...untrackedFiles,
    ],
    total:
      changedFiles.length +
      stagedFiles.length +
      untrackedFiles.length,
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

export const fileStatus = () => {
  const files = getChangedFiles();

  let output = 'Files changed:\\n\\n';
  output += [
    ...files.changed,
    ...files.staged,
  ].join('\\n');

  if (files.untracked.length > 0) {
    output += '\\nNew files:\\n';
    output += files.untracked.join('\\n');
  }

  return output;
};
