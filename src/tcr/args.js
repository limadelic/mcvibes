export const args = (params) => {
  const { comment, fileCount } = params;
  const args = [comment];
  fileCount && args.push(fileCount.toString());
  return args;
};
