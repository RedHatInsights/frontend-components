import type { Meta, StoryObj } from '@storybook/react-webpack5';
import TableToolbar from './TableToolbar';

const meta: Meta<typeof TableToolbar> = {
  title: 'Components/TableToolbar',
  component: TableToolbar,
};
export default meta;
type Story = StoryObj<typeof TableToolbar>;

export const Default: Story = {
  args: {
    results: 42,
    children: <div>Toolbar content</div>,
  },
};

export const WithSelected: Story = {
  args: {
    results: 42,
    selected: 5,
    children: <div>Toolbar content</div>,
  },
};

export const Footer: Story = {
  args: {
    isFooter: true,
    results: 10,
    children: <div>Toolbar content</div>,
  },
};

export const SingleResult: Story = {
  args: {
    results: 1,
    children: <div>Toolbar content</div>,
  },
};
