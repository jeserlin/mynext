import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import Modal from './Modal';

const meta = {
  title: 'Feedback/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
        iframeHeight: '480px',
      },
    },
  },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    title: 'Book notes',
    content: `
      <p>Language helps us understand what has happened to us.</p>
      <hr />
      <p>A remembered moment can become a whole universe.</p>
    `,
  },
};

export const Closed: Story = {
  args: {
    open: false,
    title: 'Book notes',
    content: '<p>This content is hidden while the modal is closed.</p>',
  },
};
