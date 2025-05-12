export const args = ({ comment, fileCount }) => {
  const args = [comment];
  fileCount && args.push(fileCount.toString());
  return args;
};
