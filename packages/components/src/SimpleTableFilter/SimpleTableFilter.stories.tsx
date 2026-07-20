import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';
import SimpleFilter from './SimpleTableFilter';

const meta: Meta<typeof SimpleFilter> = {
  title: 'Components/SimpleTableFilter',
  component: SimpleFilter,
};
export default meta;
type Story = StoryObj<typeof SimpleFilter>;

export const Default: Story = {
  args: {
    onFilterChange: fn(),
    placeholder: 'Search items',
  },
};

export const WithDropdown: Story = {
  args: {
    onFilterChange: fn(),
    options: {
      title: 'Category',
      items: [
        { value: 'name', title: 'Name' },
        { value: 'status', title: 'Status' },
        { value: 'type', title: 'Type' },
      ],
    },
  },
};

export const WithButton: Story = {
  args: {
    onFilterChange: fn(),
    onButtonClick: fn(),
    buttonTitle: 'Apply',
  },
};

export const NoSearchIcon: Story = {
  args: {
    onFilterChange: fn(),
    searchIcon: false,
    buttonTitle: '',
  },
};

export const CustomPlaceholder: Story = {
  args: {
    onFilterChange: fn(),
    placeholder: 'Type to search...',
  },
};
