import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';
import BulkSelect from './BulkSelect';

const meta: Meta<typeof BulkSelect> = {
  title: 'Components/BulkSelect',
  component: BulkSelect,
};
export default meta;
type Story = StoryObj<typeof BulkSelect>;

const dropdownItems = [
  { title: 'Select none', key: 'none', onClick: fn() },
  { title: 'Select page (10)', key: 'page', onClick: fn() },
  { title: 'Select all (100)', key: 'all', onClick: fn() },
];

export const WithDropdown: Story = {
  args: {
    items: dropdownItems,
    count: 5,
    onSelect: fn(),
    id: 'bulk-select',
  },
};

export const AllSelected: Story = {
  args: {
    items: dropdownItems,
    checked: true,
    count: 100,
    onSelect: fn(),
    id: 'bulk-select-all',
  },
};

export const NoneSelected: Story = {
  args: {
    items: dropdownItems,
    checked: false,
    count: 0,
    onSelect: fn(),
    id: 'bulk-select-none',
  },
};

export const CheckboxOnly: Story = {
  args: {
    checked: false,
    onSelect: fn(),
    id: 'simple-checkbox',
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    items: [{ title: 'Select all', key: 'all', onClick: fn() }],
    onSelect: fn(),
    id: 'disabled-bulk',
  },
};
