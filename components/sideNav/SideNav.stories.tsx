import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SideNav from './SideNav';

const meta = {
  title: 'Navigation/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      router: {
        route: '/cooking/[slug]',
        pathname: '/cooking/[slug]',
        asPath: '/cooking/example-recipe',
      },
    },
  },
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CookingSelected: Story = {};
