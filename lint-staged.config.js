/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  "*": "prettier --ignore-unknown --write",
  "*.{js,jsx,ts,tsx}": "eslint",
};
