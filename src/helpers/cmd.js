import { execSync } from 'child_process';

const safe = (fn) => {
  try { return fn(); } 
  catch { return false; }
};

const raw = (command) =>
  execSync(command, { encoding: 'utf8' }).trim();

export const cmd = (command) =>
  safe(() => raw(command).split('\n').filter(Boolean)) || [];

export const run = (command) =>
  safe(() => raw(command));

export default cmd;
