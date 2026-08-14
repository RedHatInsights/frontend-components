import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Skeleton, { SkeletonSize } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};

export const ExtraSmall: Story = {
  args: {
    size: SkeletonSize.xs,
  },
};

export const Small: Story = {
  args: {
    size: SkeletonSize.sm,
  },
};

export const Large: Story = {
  args: {
    size: SkeletonSize.lg,
  },
};

export const Dark: Story = {
  args: {
    isDark: true,
  },
};
