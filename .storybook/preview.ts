import type { Preview } from '@storybook/nextjs-vite';

import '../styles/globals.css';
import '../styles/post-content.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
};

export default preview;
