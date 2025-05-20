import { status } from './files.js';
import { changes } from './files.js';
import _ from 'lodash';

const msg = {
  comment:
    'in format verb:description\nExample: add:user authentication',
};

const validArgs = (params) => {
  const { comment } = params;
  return comment && /^[a-z]+:.+/.test(comment);
};

const total = (x) =>
  _.sum(_.map(x, (arr) => arr.length));

const checkLimit = (fileCount, comment) => {
  const files = changes();
  const totalFiles = total(files);

  if (totalFiles > 2 && fileCount != totalFiles)
    return {
      error: `❌ Error: Too many files changed (${totalFiles}). Maximum allowed: 2`,
      hint: `To continue, run: npm run tcr "${comment}" ${totalFiles}`,
    };

  return { files };
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
