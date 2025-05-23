import cmd from './cmd.js';

export const changed = () =>
  cmd('git diff --name-only');
export const staged = () =>
  cmd('git diff --staged --name-only');
export const untracked = () =>
  cmd('git ls-files --others --exclude-standard');

export const add = () => cmd('git add .');
export const commit = (message) =>
  cmd(`git commit -m "${message}" --quiet`);
export const reset = () =>
  cmd('git reset --hard');
export const clean = () => cmd('git clean -fd');

export default {
  changed,
  staged,
  untracked,
  add,
  commit,
  reset,
  clean,
};
