import type { Meta, StoryObj } from '@storybook/react-webpack5';
import NoRegisteredSystems from './NoRegisteredSystems';

const meta: Meta<typeof NoRegisteredSystems> = {
  title: 'Components/NoRegisteredSystems',
  component: NoRegisteredSystems,
};
export default meta;
type Story = StoryObj<typeof NoRegisteredSystems>;

export const Default: Story = {};

export const CustomText: Story = {
  args: {
    titleText: 'No systems found',
    bodyText: 'Please register your systems.',
    buttonText: 'Register now',
  },
};
