import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import PostHeader from './PostHeader';

const meta = {
  title: 'Content/PostHeader',
  component: PostHeader,
  tags: ['autodocs'],
  args: {
    title: 'A recipe worth remembering',
  },
} satisfies Meta<typeof PostHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    title: '',
  },
};
