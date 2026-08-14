import type { Meta, StoryObj } from '@storybook/react-webpack5';
import NotConnected from './NotConnected';

const meta: Meta<typeof NotConnected> = {
  title: 'Components/NotConnected',
  component: NotConnected,
};
export default meta;
type Story = StoryObj<typeof NotConnected>;

export const Default: Story = {};

export const CustomText: Story = {
  args: {
    titleText: 'System offline',
    bodyText: 'Please connect to continue.',
    buttonText: 'Connect now',
  },
};
