import React, { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, waitFor } from 'storybook/test';
import Portal from './Portal';
import NotificationsProvider from '../NotificationsProvider/NotificationsProvider';
import { useNotifications } from '../hooks/useNotifications';

const meta: Meta<typeof Portal> = {
  title: 'Notifications/Portal',
  component: Portal,
};
export default meta;
type Story = StoryObj<typeof Portal>;

/**
 * Simulates a shell-level notification (insights-chrome renders its own raw
 * Portal for persistent notices such as the language notifications) next to
 * an application-level stack (apps render NotificationsProvider).
 */
const ShellNotice = () => (
  <Portal
    notifications={[
      {
        id: 'shell-language-notice',
        variant: 'info',
        dismissable: true,
        autoDismiss: false,
        title: 'Preferred language available',
        description: 'Français language is supported by Hybrid Cloud Console now. Would you like to switch to it?',
      },
    ]}
    removeNotification={() => undefined}
  />
);

/** Simulates an application pushing a toast through its own provider. */
const AppToast = () => {
  const { addNotification } = useNotifications();
  useEffect(() => {
    addNotification({
      id: 'app-toast',
      variant: 'success',
      dismissable: true,
      autoDismiss: false,
      title: 'Role created',
      description: 'The role has been created successfully.',
    });
  }, []);
  return null;
};

/**
 * Two independent notification consumers on one page: the shell's Portal and
 * the application's NotificationsProvider. Both used to pin their own
 * `.notifications-portal` to the same viewport corner and cover each other;
 * they must stack instead.
 */
export const ShellAndApplicationStacks: Story = {
  render: () => (
    <>
      <ShellNotice />
      <NotificationsProvider>
        <AppToast />
      </NotificationsProvider>
    </>
  ),
  play: async ({ step }) => {
    await step('both stacks are mounted', async () => {
      await waitFor(() => {
        expect(document.querySelectorAll('.notifications-portal')).toHaveLength(2);
      });
    });

    await step('the stacks do not overlap', async () => {
      const [shellStack, appStack] = Array.from(document.querySelectorAll<HTMLElement>('.notifications-portal'));
      const shellRect = shellStack.getBoundingClientRect();
      const appRect = appStack.getBoundingClientRect();

      // Both stacks are laid out (non-degenerate rects relative to the viewport).
      expect(shellRect.height).toBeGreaterThan(0);
      expect(appRect.height).toBeGreaterThan(0);

      // Both columns share the right edge by design, so the collision test is
      // vertical: one stack must end before the other begins.
      const verticallyOverlapping = shellRect.top < appRect.bottom && appRect.top < shellRect.bottom;
      expect(verticallyOverlapping).toBe(false);
    });
  },
};
