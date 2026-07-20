import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';
import DownloadButton from './DownloadButton';

const meta: Meta<typeof DownloadButton> = {
  title: 'Components/DownloadButton',
  component: DownloadButton,
  args: {
    onSelect: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof DownloadButton>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const CustomLabels: Story = {
  args: {
    itemTexts: {
      csv: 'Download CSV Report',
      json: 'Download JSON Report',
    },
  },
};
