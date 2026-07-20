import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';
import FilterChips from './FilterChips';

const meta: Meta<typeof FilterChips> = {
  title: 'Components/FilterChips',
  component: FilterChips,
};
export default meta;
type Story = StoryObj<typeof FilterChips>;

export const UngroupedChips: Story = {
  args: {
    filters: [{ name: 'Active' }, { name: 'Critical' }, { name: 'High' }],
    onDelete: fn(),
  },
};

export const GroupedChips: Story = {
  args: {
    filters: [
      { category: 'Status', chips: [{ name: 'Active' }, { name: 'Inactive' }] },
      { category: 'Severity', chips: [{ name: 'Critical' }, { name: 'High' }] },
    ],
    onDelete: fn(),
    onDeleteGroup: fn(),
  },
};

export const WithBadgeCounts: Story = {
  args: {
    filters: [
      {
        category: 'Type',
        chips: [
          { name: 'Error', count: 12, id: 'error' },
          { name: 'Warning', count: 5, id: 'warning' },
        ],
      },
    ],
    onDelete: fn(),
  },
};

export const CustomDeleteTitle: Story = {
  args: {
    filters: [{ name: 'Filter 1' }, { name: 'Filter 2' }],
    onDelete: fn(),
    deleteTitle: 'Reset all',
  },
};

export const HiddenDeleteButton: Story = {
  args: {
    filters: [{ name: 'Filter 1' }],
    onDelete: fn(),
    showDeleteButton: false,
  },
};
