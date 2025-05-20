import { status, total } from './files.js';

const msg = {
  comment:
    'in format verb:description\nExample: add:user authentication',
};

const validArgs = ({ comment }) =>
  comment && /^[a-z]+:.+/.test(comment);

const checkLimit = (fileCount, comment) => {
  const totalFiles = total();

  if (totalFiles > 2 && fileCount != totalFiles)
    return { error: true, totalFiles };

  return { files };
};

const validFiles = ({ fileCount }) => {
  const totalFiles = total();
  return !(
    totalFiles > 2 && fileCount != totalFiles
  );
};

export const valid = (params) =>
  validArgs(params) && validFiles(params);

const errorArgs = (params) => {
  const { comment } = params;
  if (!comment)
    return `❌ Error: Commit message required ${msg.comment}`;

  if (!/^[a-z]+:.+/.test(comment))
    return `❌ Error: Message must be ${msg.comment}`;

  return null;
};

const errorFiles = (params) => {
  const { comment, fileCount } = params;
  const result = checkLimit(fileCount, comment);

  if (result.error)
    return (
      status() +
      `\n\n❌ Error: Too many files changed (${result.totalFiles}). Maximum allowed: 2\nTo continue, run: npm run tcr "${comment}" ${result.totalFiles}`
    );

  return null;
};

export const error = (params) =>
  errorArgs(params) || errorFiles(params);
