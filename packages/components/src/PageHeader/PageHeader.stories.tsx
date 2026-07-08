import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PageHeader from './PageHeader';
import PageHeaderTitle from './PageHeaderTitle';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
};
export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderTitle title="My Application" />
    </PageHeader>
  ),
};

export const WithActions: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderTitle title="Dashboard" actionsContent={<button>Action</button>} />
    </PageHeader>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <PageHeader>
      <h1>Custom header</h1>
      <p>Some description</p>
    </PageHeader>
  ),
};
