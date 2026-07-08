import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';
import FilterDropdown from './FilterDropdown';

const meta: Meta<typeof FilterDropdown> = {
  title: 'Components/FilterDropdown',
  component: FilterDropdown,
};
export default meta;
type Story = StoryObj<typeof FilterDropdown>;

export const Default: Story = {
  args: {
    label: 'Filter',
    filterCategories: [
      {
        title: 'Status',
        urlParam: 'status',
        type: 'checkbox',
        values: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ],
      },
      {
        title: 'Type',
        urlParam: 'type',
        type: 'checkbox',
        values: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ],
      },
    ],
    addFilter: fn(),
    removeFilter: fn(),
  },
};

export const RadioFilters: Story = {
  args: {
    label: 'Filter',
    filterCategories: [
      {
        title: 'Status',
        urlParam: 'status',
        type: 'radio',
        values: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ],
      },
      {
        title: 'Type',
        urlParam: 'type',
        type: 'radio',
        values: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ],
      },
    ],
    addFilter: fn(),
    removeFilter: fn(),
  },
};

export const SingleCategory: Story = {
  args: {
    label: 'Filter',
    filterCategories: [
      {
        title: 'Status',
        urlParam: 'status',
        type: 'checkbox',
        values: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ],
      },
    ],
    addFilter: fn(),
    removeFilter: fn(),
  },
};
