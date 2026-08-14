import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Section from './Section';

const meta: Meta<typeof Section> = {
  title: 'Components/Section',
  component: Section,
};
export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {
  args: {
    children: 'Section content goes here',
  },
};

export const WithType: Story = {
  args: {
    type: 'content',
    children: 'Content section',
  },
};
