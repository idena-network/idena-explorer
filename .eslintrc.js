// eslint-disable-next-line no-undef
module.exports = {
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/prop-types': [0],
    'no-shadow': [0],
    'no-use-before-define': ['error', 'nofunc'],
    'no-nested-ternary': [0],
  },
  plugins: ['react'],
  extends: ['wesbos'],
}
