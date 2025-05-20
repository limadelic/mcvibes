import { status, total } from './files.js';

const msg = {
  comment:
    'in format verb:description\nExample: add:user authentication',
};

const validArgs = ({ comment }) =>
  comment && /^[a-z]+:.+/.test(comment);

const validFiles = ({ fileCount }) =>
  total() <= 2 || fileCount == total();

export const valid = (params) =>
  validArgs(params) && validFiles(params);

const errorArgs = ({ comment }) => {
  if (validArgs({ comment })) return null;

  return !comment
    ? `❌ Error: Commit message required ${msg.comment}`
    : `❌ Error: Message must be ${msg.comment}`;
};

const errorFiles = ({ comment, fileCount }) => {
  if (validFiles({ fileCount })) return null;

  return (
    status() +
    `\n\n❌ Error: Too many files changed (${total()}). Maximum allowed: 2\nTo continue, run: npm run tcr "${comment}" ${total()}`
  );
};

export const error = (params) =>
  errorArgs(params) || errorFiles(params);
