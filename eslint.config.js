module.exports = [
  {
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'commonjs',
      globals: {
        ...require('globals').node
      }
    },
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'no-console': 'off'
    }
  }
];