import type { Meta, StoryObj } from '@storybook/react-webpack5';
import SeverityLine from './SeverityLine';

const meta: Meta<typeof SeverityLine> = {
  title: 'Components/SeverityLine',
  component: SeverityLine,
};
export default meta;
type Story = StoryObj<typeof SeverityLine>;

export const Low: Story = {
  args: {
    title: 'Low severity',
    value: 1,
  },
};

export const Medium: Story = {
  args: {
    title: 'Medium severity',
    value: 2,
  },
};

export const High: Story = {
  args: {
    title: 'High severity',
    value: 3,
  },
};

export const Critical: Story = {
  args: {
    title: 'Critical severity',
    value: 4,
  },
};

export const WithTooltip: Story = {
  args: {
    title: 'Custom tooltip',
    value: 3,
    tooltipMessage: 'This is a high-severity issue',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Very long severity title that truncates',
    value: 2,
  },
};

export const CustomSize: Story = {
  args: {
    title: 'Custom size',
    value: 3,
    config: { height: 20, width: 400 },
  },
};
