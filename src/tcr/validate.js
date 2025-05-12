const msg = {
  comment:
    'in format verb:description\nExample: add:user authentication',
};

export const bad = ({ comment }) =>
  !comment || !/^[a-z]+:.+/.test(comment);

export const errors = ({ comment }) => {
  if (!comment)
    return `❌ Error: Commit message required ${msg.comment}`;

  if (!/^[a-z]+:.+/.test(comment))
    return `❌ Error: Message must be ${msg.comment}`;

  return null;
};
