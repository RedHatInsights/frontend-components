import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';
import PrimaryToolbar from './PrimaryToolbar';

const meta: Meta<typeof PrimaryToolbar> = {
  title: 'Components/PrimaryToolbar',
  component: PrimaryToolbar,
};
export default meta;
type Story = StoryObj<typeof PrimaryToolbar>;

export const WithPagination: Story = {
  args: {
    pagination: {
      itemCount: 100,
      page: 1,
      perPage: 20,
      onSetPage: fn(),
      onPerPageSelect: fn(),
    },
  },
};

export const WithFilter: Story = {
  args: {
    filterConfig: {
      items: [
        {
          type: 'text' as const,
          label: 'Name',
          filterValues: {
            onChange: fn(),
            placeholder: 'Filter by name',
          },
        },
      ],
    },
  },
};

export const WithActiveFilters: Story = {
  args: {
    activeFiltersConfig: {
      filters: [{ category: 'Status', chips: [{ name: 'Active' }] }],
      onDelete: fn(),
    },
  },
};

export const WithExport: Story = {
  args: {
    exportConfig: {
      onSelect: fn(),
    },
  },
};

export const FullToolbar: Story = {
  args: {
    pagination: {
      itemCount: 100,
      page: 1,
      perPage: 20,
      onSetPage: fn(),
      onPerPageSelect: fn(),
    },
    filterConfig: {
      items: [
        {
          type: 'text' as const,
          label: 'Name',
          filterValues: {
            onChange: fn(),
            placeholder: 'Filter by name',
          },
        },
      ],
    },
    activeFiltersConfig: {
      filters: [{ category: 'Status', chips: [{ name: 'Active' }] }],
      onDelete: fn(),
    },
    exportConfig: {
      onSelect: fn(),
    },
  },
};

export const WithBulkSelect: Story = {
  args: {
    bulkSelect: {
      items: [{ title: 'Select none' }, { title: 'Select all' }],
      checked: false,
      count: 0,
      onSelect: fn(),
    },
  },
};
