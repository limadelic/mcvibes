import { execSync } from 'child_process';

const raw = (command) => {
  try {
    return {
      success: true,
      output: execSync(command, { encoding: 'utf8' }).trim()
    };
  } catch (error) {
    return {
      success: false,
      output: error.stdout || '',
      error: error.stderr || error.message
    };
  }
};

export const cmd = (command) => {
  const result = raw(command);
  return result.success ? result.output.split('\n').filter(Boolean) : [];
};

export const run = (command) => raw(command);

export default cmd;
