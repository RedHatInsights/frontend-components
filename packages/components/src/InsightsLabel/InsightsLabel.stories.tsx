import type { Meta, StoryObj } from '@storybook/react-webpack5';
import InsightsLabel from './InsightsLabel';

const meta: Meta<typeof InsightsLabel> = {
  title: 'Components/InsightsLabel',
  component: InsightsLabel,
};
export default meta;
type Story = StoryObj<typeof InsightsLabel>;

export const Low: Story = {
  args: {
    value: 1,
  },
};

export const Moderate: Story = {
  args: {
    value: 2,
  },
};

export const Important: Story = {
  args: {
    value: 3,
  },
};

export const Critical: Story = {
  args: {
    value: 4,
  },
};

export const CustomText: Story = {
  args: {
    value: 3,
    text: 'Custom severity',
  },
};

export const NoIcon: Story = {
  args: {
    value: 2,
    hideIcon: true,
  },
};
