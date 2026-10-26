import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import RecipeFilters, { type RecipeCategory } from './RecipeFilters';

const labelsByCategory: Record<RecipeCategory, string[]> = {
  all: [],
  cooking: ['soup', 'pasta'],
  baking: ['cookie', '貝果'],
};

interface ExampleProps {
  initialCategory?: RecipeCategory;
  initialLabel?: string | null;
  initialQuery?: string;
}

const Example = ({
  initialCategory = 'all',
  initialLabel = null,
  initialQuery = '',
}: ExampleProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLabel, setSelectedLabel] = useState(initialLabel);

  return (
    <RecipeFilters
      query={query}
      onQueryChange={setQuery}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      availableLabels={labelsByCategory[selectedCategory]}
      selectedLabel={selectedLabel}
      onLabelChange={setSelectedLabel}
    />
  );
};

const meta = {
  title: 'Recipes/RecipeFilters',
  component: RecipeFilters,
  tags: ['autodocs'],
  args: {
    query: '',
    onQueryChange: () => {},
    selectedCategory: 'all',
    onCategoryChange: () => {},
    availableLabels: [],
    selectedLabel: null,
    onLabelChange: () => {},
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
        iframeHeight: '240px',
      },
    },
  },
  decorators: [
    (Story) => <div className="mx-auto max-w-[1200px] px-4 py-6"><Story /></div>,
  ],
} satisfies Meta<typeof RecipeFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  render: () => <Example />,
};

export const CookingWithLabel: Story = {
  render: () => <Example initialCategory="cooking" initialLabel="pasta" />,
};

export const BakingWithLabel: Story = {
  render: () => <Example initialCategory="baking" initialLabel="貝果" />,
};

export const MobileClosed: Story = {
  globals: { viewport: 'mobile1' },
  render: () => <Example />,
};

export const MobileOpen: Story = {
  globals: { viewport: 'mobile1' },
  render: () => <Example initialQuery="pasta" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Open recipe search' });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  },
};
