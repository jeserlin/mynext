import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  expect, userEvent, waitFor, within,
} from 'storybook/test';

import Header from './Header';

const meta = {
  title: 'Navigation/Header',
  component: Header,
  tags: ['autodocs'],
  globals: {
    viewport: 'mobile1',
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        autoplay: true,
        iframeHeight: '420px',
        inline: false,
      },
    },
    nextjs: {
      router: {
        route: '/tech/[slug]',
        pathname: '/tech/[slug]',
        asPath: '/tech/example-post',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="storybook-mobile-header min-h-[420px] max-w-[320px] overflow-hidden">
        <style>
          {`
            .storybook-header-component > div:nth-of-type(1) {
              display: flex !important;
              max-width: 320px;
            }
            .storybook-header-component > div:nth-of-type(2),
            .storybook-header-component > button {
              display: block !important;
              max-width: 320px;
              right: auto;
              width: 100%;
            }
            .storybook-header-component button[aria-expanded="true"] {
              background-color: var(--color-base-200);
            }
          `}
        </style>
        <div aria-hidden="true" className="space-y-6 px-4 pt-[72px]">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-4">
              <div className="h-[72px] w-[72px] shrink-0 rounded-lg bg-info-content/80" />
              <div className="h-[140px] flex-1 rounded-lg bg-custom-light p-4">
                <div className="mb-4 h-5 w-4/5 rounded bg-gray-light" />
                <div className="mb-3 h-4 w-2/3 rounded bg-gray-light" />
                <div className="h-3 w-1/2 rounded bg-gray-light" />
              </div>
            </div>
          ))}
        </div>
        <div className="storybook-header-component">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Toggle menu' });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    toggle.blur();
    await userEvent.hover(toggle);
    const navigation = canvas.getByRole('navigation', { name: 'Mobile navigation' });
    await waitFor(() => {
      expect(navigation).toBeVisible();
      expect(navigation.parentElement?.getBoundingClientRect().height).toBeGreaterThan(250);
    });
  },
};
