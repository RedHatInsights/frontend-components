import type { Meta, StoryObj } from '@storybook/react-webpack5';
import DateFormat from './DateFormat';

const meta: Meta<typeof DateFormat> = {
  title: 'Components/DateFormat',
  component: DateFormat,
};
export default meta;
type Story = StoryObj<typeof DateFormat>;

export const Relative: Story = {
  args: {
    date: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    type: 'relative',
  },
};

export const ExactDate: Story = {
  args: {
    date: '2024-01-15T10:30:00Z',
    type: 'exact',
  },
};

export const OnlyDate: Story = {
  args: {
    date: '2024-06-15',
    type: 'onlyDate',
  },
};
