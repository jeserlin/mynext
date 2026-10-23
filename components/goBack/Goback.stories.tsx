import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import GoBack from './Goback';

const push = fn();

const meta = {
  title: 'Navigation/GoBack',
  component: GoBack,
  tags: ['autodocs'],
  args: {
    path: '/tech',
  },
  parameters: {
    nextjs: {
      router: {
        push,
      },
    },
  },
} satisfies Meta<typeof GoBack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
