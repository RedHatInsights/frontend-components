import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EmptyTable from './EmptyTable';

const meta: Meta<typeof EmptyTable> = {
  title: 'Components/EmptyTable',
  component: EmptyTable,
};
export default meta;
type Story = StoryObj<typeof EmptyTable>;

export const Default: Story = {
  args: {
    children: 'No data available',
  },
};

export const Centered: Story = {
  args: {
    centered: true,
    children: 'No data available',
  },
};
