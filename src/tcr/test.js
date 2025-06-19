import { run } from '../helpers/cmd.js';
import { project } from '../helpers/project.js';

export const test = () => {
  const result = run(project.test);
  return result.success;
};

export default test;
