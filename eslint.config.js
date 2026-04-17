const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');

module.exports = [
  ...nextCoreWebVitals,
  {
    ignores: [
      '.claude/**',
      'jsconfig.json',
      'package.json',
      'package-lock.json',
    ],
  },
  {
    files: ['**/*.{js,jsx}'],
    settings: {
      'import/resolver': {
        node: {
          paths: ['.'],
        },
      },
    },
    rules: {
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
        },
      ],
    },
  },
];
