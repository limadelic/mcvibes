import { execSync } from 'child_process';

export const format = () =>
  execSync('npm run pretty', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'],
  });
