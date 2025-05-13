import cmd from './cmd.js';

export const changed = () =>
  cmd('git diff --name-only');
export const staged = () =>
  cmd('git diff --staged --name-only');
export const untracked = () =>
  cmd('git ls-files --others --exclude-standard');
export const deleted = () =>
  cmd('git ls-files --deleted');

export default {
  changed,
  staged,
  untracked,
  deleted,
};
