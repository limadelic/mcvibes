import cmd from './cmd.js';

export const test = () =>
  cmd(
    'npm run build --silent && npm run test --silent'
  );

export default {
  test,
};
