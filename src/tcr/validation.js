import { checkLimit } from './files.js';
import { status } from './files.js';

const msg = {
  comment:
    'in format verb:description\nExample: add:user authentication',
};

const validArgs = (params) => {
  const { comment } = params;
  return comment && /^[a-z]+:.+/.test(comment);
};

const validFiles = (params) => {
  const { comment, fileCount } = params;
  const result = checkLimit(fileCount, comment);
  return !result.error;
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
      '\n\n' +
      result.error +
      '\n' +
      result.hint
    );

  return null;
};

export const error = (params) => {
  const argError = errorArgs(params);
  if (argError) return argError;

  return errorFiles(params);
};
