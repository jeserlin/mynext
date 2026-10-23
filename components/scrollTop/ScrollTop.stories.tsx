import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ScrollTop from './ScrollTop';

const meta = {
  title: 'Navigation/ScrollTop',
  component: ScrollTop,
  tags: ['autodocs'],
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
    (Story) => (
      <div className="min-h-[400px] p-8">
        <div id="back-to-top-anchor">Top of the page</div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScrollTop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AfterScrolling: Story = {
  play: async ({ canvasElement }) => {
    const storyWindow = canvasElement.ownerDocument.defaultView;
    if (!storyWindow) return;

    Object.defineProperty(storyWindow, 'scrollY', {
      configurable: true,
      value: 150,
    });
    storyWindow.dispatchEvent(new storyWindow.Event('scroll'));
  },
};
