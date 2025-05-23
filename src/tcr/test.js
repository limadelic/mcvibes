import npm from '../helpers/npm.js';

export const test = () => {
  try {
    npm.test();
    return true;
  } catch {
    return false;
  }
};

export default test;
