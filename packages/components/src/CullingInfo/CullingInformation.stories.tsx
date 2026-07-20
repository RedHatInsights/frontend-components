import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CullingInformation from './CullingInformation';

const meta: Meta<typeof CullingInformation> = {
  title: 'Components/CullingInformation',
  component: CullingInformation,
};
export default meta;
type Story = StoryObj<typeof CullingInformation>;

export const Fresh: Story = {
  render: () => (
    <CullingInformation
      content=""
      stale={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}
      staleWarning={new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()}
      culled={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()}
      currDate={new Date().toISOString()}
      className=""
    >
      <span>Last seen: just now</span>
    </CullingInformation>
  ),
};

export const StaleWarning: Story = {
  render: () => (
    <CullingInformation
      content=""
      stale={new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()}
      staleWarning={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()}
      culled={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()}
      currDate={new Date().toISOString()}
      className=""
    >
      <span>Last seen: 20 days ago</span>
    </CullingInformation>
  ),
};

export const CullingDanger: Story = {
  render: () => (
    <CullingInformation
      content=""
      stale={new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()}
      staleWarning={new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()}
      culled={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
      currDate={new Date().toISOString()}
      className=""
    >
      <span>Last seen: 45 days ago</span>
    </CullingInformation>
  ),
};

export const WithCustomRender: Story = {
  render: () => (
    <CullingInformation
      content=""
      stale={new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()}
      staleWarning={new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()}
      culled={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
      currDate={new Date().toISOString()}
      className=""
      render={({ msg }) => <span>Custom: {msg}</span>}
    />
  ),
};
