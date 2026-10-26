import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import BookCard from './BookCard';

const meta = {
  title: 'Books/BookCard',
  component: BookCard,
  tags: ['autodocs'],
  args: {
    title: '深夜圖書館的宵夜',
    author: '原田比香',
    coverImage: 'https://media.publit.io/file/reading/9786267483794.png',
    content: '還是就因為，世間沒有永遠，所以眼下如此美好吧？',
    onSelectNotes: fn(),
  },
  decorators: [
    (Story) => <div className="w-[180px]"><Story /></div>,
  ],
} satisfies Meta<typeof BookCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithNotes: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Read notes for 深夜圖書館的宵夜' }));
    await expect(args.onSelectNotes).toHaveBeenCalledOnce();
  },
};

export const WithoutNotes: Story = {
  args: {
    title: '小鳥：《博士熱愛的算式》',
    author: '小川洋子',
    coverImage: 'https://media.publit.io/file/reading/9786263143630.png',
    content: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: '小鳥：《博士熱愛的算式》' })).toBeDisabled();
  },
};

export const MissingCover: Story = {
  args: {
    coverImage: undefined,
  },
};
