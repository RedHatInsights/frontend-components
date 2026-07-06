import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Truncate from './Truncate';

const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

const meta: Meta<typeof Truncate> = {
  title: 'Components/Truncate',
  component: Truncate,
};
export default meta;
type Story = StoryObj<typeof Truncate>;

export const Default: Story = {
  args: {
    text: longText,
    length: 100,
  },
};

export const Inline: Story = {
  args: {
    text: longText,
    inline: true,
    length: 80,
  },
};

export const ShortText: Story = {
  args: {
    text: 'Short text',
    length: 150,
  },
};

export const ExpandOnHover: Story = {
  args: {
    text: longText,
    expandOnMouseOver: true,
    length: 100,
  },
};

export const NoExpandButton: Story = {
  args: {
    text: longText,
    hideExpandText: true,
    length: 100,
  },
};

export const WithSpaceBetween: Story = {
  args: {
    text: longText,
    spaceBetween: true,
    length: 100,
  },
};
