import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Shield from './Shield';

const meta: Meta<typeof Shield> = {
  title: 'Components/Shield',
  component: Shield,
};
export default meta;
type Story = StoryObj<typeof Shield>;

export const Critical: Story = {
  args: {
    impact: 'Critical',
  },
};

export const Important: Story = {
  args: {
    impact: 'Important',
    hasLabel: true,
  },
};

export const Moderate: Story = {
  args: {
    impact: 'Moderate',
    hasLabel: true,
  },
};

export const Low: Story = {
  args: {
    impact: 'Low',
    hasLabel: true,
  },
};

export const Unknown: Story = {
  args: {
    impact: 'N/A',
  },
};

export const WithoutTooltip: Story = {
  args: {
    impact: 'Critical',
    hasTooltip: false,
    hasLabel: true,
  },
};

export const WithoutQuestionIcon: Story = {
  args: {
    impact: 'N/A',
    disableQuestionIcon: true,
  },
};
