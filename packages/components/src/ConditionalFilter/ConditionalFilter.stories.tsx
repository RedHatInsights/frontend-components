import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';
import ConditionalFilter from './ConditionalFilter';

const meta: Meta<typeof ConditionalFilter> = {
  title: 'Components/ConditionalFilter',
  component: ConditionalFilter,
};
export default meta;
type Story = StoryObj<typeof ConditionalFilter>;

export const TextFilter: Story = {
  args: {
    items: [
      {
        type: 'text',
        label: 'Name',
        filterValues: {
          onChange: fn(),
          value: '',
          placeholder: 'Filter by name',
        },
      },
    ],
  },
};

export const CheckboxFilter: Story = {
  args: {
    items: [
      {
        type: 'checkbox',
        label: 'Status',
        filterValues: {
          onChange: fn(),
          items: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Pending', value: 'pending' },
          ],
        },
      },
    ],
  },
};

export const MultipleFilters: Story = {
  args: {
    items: [
      {
        type: 'text',
        label: 'Name',
        filterValues: {
          onChange: fn(),
          placeholder: 'Filter by name',
        },
      },
      {
        type: 'checkbox',
        label: 'Status',
        filterValues: {
          onChange: fn(),
          items: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ],
        },
      },
    ],
  },
};

export const HiddenLabel: Story = {
  args: {
    hideLabel: true,
    items: [
      {
        type: 'text',
        label: 'Name',
        filterValues: {
          onChange: fn(),
          placeholder: 'Filter by name',
        },
      },
      {
        type: 'checkbox',
        label: 'Status',
        filterValues: {
          onChange: fn(),
          items: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ],
        },
      },
    ],
  },
};
