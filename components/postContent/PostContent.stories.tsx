import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import PostContent from './PostContent';

const meta = {
  title: 'Content/PostContent',
  component: PostContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof PostContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArticleExcerpt: Story = {
  args: {
    content: `
      <h3>A small story</h3>
      <p>Good food starts with simple ingredients and enough time.</p>
      <hr />
      <p>Keep notes so the next attempt can be even better.</p>
    `,
  },
};

export const Empty: Story = {
  args: {
    content: '',
  },
};
