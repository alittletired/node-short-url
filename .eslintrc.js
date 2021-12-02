module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // to use prettier set of rules
    'airbnb-base',
  ],
  rules: {
    'linebreak-style': 0,
    semi: 0,
  },
}
