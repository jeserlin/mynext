import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import RecipeCard from './RecipeCard';

const meta = {
  title: 'Recipes/RecipeCard',
  component: RecipeCard,
  tags: ['autodocs'],
  args: {
    slug: 'bagel',
    title: '全麥貝果',
    type: 'baking',
    coverImage: 'https://media.publit.io/file/baking/bagel.png',
    labels: ['貝果', 'bagel'],
    loading: 'lazy',
  },
  parameters: {
    nextjs: {
      router: {
        pathname: '/recipes',
        asPath: '/recipes',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="storybook-recipe-card w-[268px]">
        <style>
          {`
            .storybook-recipe-card .recipe-card-media { aspect-ratio: 3 / 2; }
            .storybook-recipe-card .recipe-card-content { padding: 0.625rem; }
            .storybook-recipe-card .recipe-card-title { font-size: 1rem; line-height: 1.375rem; }
          `}
        </style>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RecipeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MissingImage: Story = {
  args: {
    coverImage: undefined,
  },
};

export const LongTitle: Story = {
  args: {
    title: 'A Long Recipe Title That Wraps Across More Than One Line',
    labels: ['weekend baking'],
  },
};
