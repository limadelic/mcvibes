import npm from '../helpers/npm.js';

export const test = () => npm.test().length === 0;

export default test;
