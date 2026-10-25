const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');

module.exports = [
  ...nextCoreWebVitals,
  {
    ignores: [
      '.claude/**',
      'jsconfig.json',
      'tsconfig.json',
      'package.json',
      'package-lock.json',
    ],
  },
];
