import { spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(
  fileURLToPath(import.meta.url)
);

export default (script, args = []) =>
  spawnSync(
    'bash',
    [join(__dirname, `../${script}.sh`), ...args],
    {
      encoding: 'utf8',
      stdio: 'pipe',
    }
  ).stdout;
