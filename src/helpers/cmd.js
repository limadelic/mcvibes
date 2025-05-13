import { execSync } from 'child_process';

const raw = (command) =>
  execSync(command, { encoding: 'utf8' }).trim();

export const cmd = (command) =>
  raw(command).split('\n').filter(Boolean);

export default cmd;
