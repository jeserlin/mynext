import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useArgs } from 'storybook/preview-api';
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
  render: function Render(args) {
    const [{ open }, updateArgs] = useArgs();

    const handleClose = () => {
      args.onClose?.();
      updateArgs({ open: false });
    };

    return (
      <>
        {!open && (
          <div className="flex min-h-[240px] items-center justify-center bg-base-100">
            <button
              type="button"
              className="btn btn-secondary text-white"
              onClick={() => updateArgs({ open: true })}
            >
              Open modal
            </button>
          </div>
        )}
        <Modal {...args} open={Boolean(open)} onClose={handleClose} />
      </>
    );
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
