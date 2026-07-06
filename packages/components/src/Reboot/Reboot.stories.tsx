import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Reboot from './Reboot';

const meta: Meta<typeof Reboot> = {
  title: 'Components/Reboot',
  component: Reboot,
};
export default meta;
type Story = StoryObj<typeof Reboot>;

export const Default: Story = {};

export const Red: Story = {
  args: {
    red: true,
  },
};
