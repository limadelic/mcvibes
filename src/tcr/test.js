import { run } from '../helpers/cmd.js';
import project from '../helpers/project.js';

export const test = () => run(project.test);

export default test;
