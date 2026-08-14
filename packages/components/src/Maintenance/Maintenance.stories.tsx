import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Maintenance from './Maintenance';

const meta: Meta<typeof Maintenance> = {
  title: 'Components/Maintenance',
  component: Maintenance,
};
export default meta;
type Story = StoryObj<typeof Maintenance>;

export const Default: Story = {};

export const CustomTimes: Story = {
  args: {
    utcStartTime: '2pm',
    utcEndTime: '4pm',
    startTime: '10am',
    endTime: '12pm',
    timeZone: 'PST',
  },
};

export const CustomDescription: Story = {
  args: {
    description: 'System upgrade in progress.',
  },
};
