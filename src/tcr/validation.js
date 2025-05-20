import { status, total } from './files.js';

const msg = {
  comment:
    'in format verb:description\nExample: add:user authentication',
};

const validArgs = ({ comment }) =>
  comment && /^[a-z]+:.+/.test(comment);

const checkLimit = (fileCount, comment) =>
  total() > 2 && fileCount != total()
    ? { error: true, totalFiles: total() }
    : { files: true };

const validFiles = ({ fileCount }) =>
  total() <= 2 || fileCount == total();

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
