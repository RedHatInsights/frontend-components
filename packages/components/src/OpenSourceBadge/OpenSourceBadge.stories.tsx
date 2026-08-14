import type { Meta, StoryObj } from '@storybook/react-webpack5';
import OpenSourceBadge from './OpenSourceBadge';

const meta: Meta<typeof OpenSourceBadge> = {
  title: 'Components/OpenSourceBadge',
  component: OpenSourceBadge,
};
export default meta;
type Story = StoryObj<typeof OpenSourceBadge>;

export const Default: Story = {
  args: {
    repositoriesURL: 'https://github.com/RedHatInsights',
  },
};
