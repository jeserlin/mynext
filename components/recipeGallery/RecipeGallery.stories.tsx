import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import RecipeGallery from './RecipeGallery';

const meta = {
  title: 'Recipes/RecipeGallery',
  component: RecipeGallery,
  tags: ['autodocs'],
  args: {
    title: '山藥排骨湯',
    coverImage: '/assets/posts/cooking/pork_bone_soup_with_yam.png',
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: '420px',
      },
    },
  },
  decorators: [
    (Story) => <div className="w-full max-w-[400px]"><Story /></div>,
  ],
} satisfies Meta<typeof RecipeGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleImage: Story = {};

export const MultipleImages: Story = {
  args: {
    title: '義大利經典肉醬',
    coverImage: '/assets/posts/cooking/bolognese_sauce.png',
    gallery: ['https://media.publit.io/file/cooking/bolognese-sauce-2.png'],
  },
};

export const NoImage: Story = {
  args: {
    coverImage: undefined,
    gallery: [],
  },
  render: (args) => (
    <div className="rounded-lg border border-dashed border-[#d9cbbc] px-6 py-8 text-center text-sm text-[#75665b]">
      <RecipeGallery {...args} />
      The gallery renders nothing when a recipe has no images.
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'When a recipe has no images, the gallery renders nothing.',
      },
    },
  },
};
