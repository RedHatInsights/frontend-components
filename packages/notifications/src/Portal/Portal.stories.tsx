import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, waitFor, within } from 'storybook/test';
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

/**
 * An independent consumer with its own dismissable notifications.
 */
const Stack = ({ stackId, title, count, lastTitle }: { stackId: string; title: string; count: number; lastTitle?: string }) => {
  const [notifications, setNotifications] = useState(() =>
    Array.from({ length: count }, (_, index) => ({
      id: `${stackId}-${index}`,
      variant: 'info' as const,
      dismissable: true,
      autoDismiss: false,
      title: index === count - 1 && lastTitle ? lastTitle : `${title} ${index + 1} of ${count}`,
    })),
  );
  return (
    <Portal
      notifications={notifications}
      removeNotification={(id) => setNotifications((previous) => previous.filter((notification) => notification.id !== id))}
    />
  );
};

/**
 * Four consumers with five notifications each — twenty notifications in one
 * shared stack. Today the console mounts at most two consumers (the shell
 * plus one application), but nothing guarantees that, and the shared root
 * must degrade safely when the combined stack overflows the viewport: the
 * stack is clipped, never scrollable, and dismissing notifications shrinks
 * it until the ones hidden under the fold come into view.
 */
export const OverflowingStacks: Story = {
  name: 'Four consumers, five notifications each',
  render: () => (
    <>
      <Stack stackId="shell" title="Shell notice" count={5} />
      <Stack stackId="application-a" title="Application A toast" count={5} />
      <Stack stackId="application-b" title="Application B toast" count={5} />
      <Stack stackId="application-c" title="Application C toast" count={5} lastTitle="Bottom of the last stack" />
    </>
  ),
  play: async ({ step }) => {
    const user = userEvent.setup();

    await step('twenty notifications across four stacks', async () => {
      await waitFor(() => {
        expect(document.querySelectorAll('.notifications-portal')).toHaveLength(4);
        expect(document.querySelectorAll('button[aria-label="close-notification"]')).toHaveLength(20);
      });
    });

    await step('the combined stack overflows the viewport', async () => {
      const root = document.querySelector('[data-notifications-root]');
      expect(root).not.toBeNull();
      expect(root!.scrollHeight).toBeGreaterThan(root!.clientHeight);
      // The last notification is hidden below the visible area.
      const bottom = within(document.body).getByText('Bottom of the last stack');
      expect(bottom.getBoundingClientRect().bottom).toBeGreaterThan(window.innerHeight);
    });

    await step('dismissing notifications reveals the hidden ones', async () => {
      // Dismiss the topmost notification until the bottom one is in view.
      // If the stack never reveals it, the loop exhausts and the final
      // assertion fails.
      for (let dismissed = 0; dismissed < 20; dismissed++) {
        const bottom = within(document.body).queryByText('Bottom of the last stack');
        if (bottom && bottom.getBoundingClientRect().bottom <= window.innerHeight) {
          break;
        }
        const closeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('button[aria-label="close-notification"]'));
        expect(closeButtons.length).toBeGreaterThan(0);
        await user.click(closeButtons[0]);
      }
      const bottom = within(document.body).getByText('Bottom of the last stack');
      expect(bottom.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight);
    });
  },
};
