/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#d7cebe',
          'primary-content': '#9c9085',
          secondary: '#9c8686',
          'secondary-content': '#a2746a',
          accent: '#8c8c8c',
          'accent-content': '#110700',
          neutral: '#022536',
          'neutral-content': '#c8cfd3',
          'base-100': '#888',
          'base-200': '#555',
          'base-300': '#383838',
          'base-content': '#d2cdc9',
          info: '#00c7ee',
          'info-content': '#1976d2',
          success: '#81c784',
          'success-content': '#388e3c',
          warning: '#ffb74d',
          'warning-content': '#ff9800',
          error: '#e57373',
          'error-content': '#d32f2f',
        },
      },
    ],
  },
};
