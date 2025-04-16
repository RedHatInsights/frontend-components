import { useNotifications } from '../hooks/useNotifications';
import { createStore } from '../state';
import NotificationsProvider from './NotificationsProvider';
import { act, render, screen } from '@testing-library/react';

const DummyComponent = () => {
  const { addNotification, clearNotifications } = useNotifications();
  return (
    <>
      <div>Dummy Component</div>
      <button onClick={() => addNotification({ title: 'Test Notification', variant: 'info' })}>Add Notification</button>
      <button onClick={clearNotifications}>Clear Notifications</button>
    </>
  );
};

describe('NotificationsProvider', () => {
  it('should render children', () => {
    render(
      <NotificationsProvider>
        <DummyComponent />
      </NotificationsProvider>
    );

    expect(screen.getByText('Dummy Component')).toBeInTheDocument();
  });

  it('should add a notification and close', () => {
    render(
      <NotificationsProvider>
        <DummyComponent />
      </NotificationsProvider>
    );

    const addButton = screen.getByText('Add Notification');
    act(() => {
      addButton.click();
    });

    expect(screen.getByText('Test Notification')).toBeInTheDocument();

    act(() => {
      screen.getByLabelText('close-notification').click();
    });
    expect(screen.queryByText('Test Notification')).not.toBeInTheDocument();
  });

  it('should clear notifications', () => {
    render(
      <NotificationsProvider>
        <DummyComponent />
      </NotificationsProvider>
    );

    const addButton = screen.getByText('Add Notification');
    act(() => {
      addButton.click();
    });

    expect(screen.getByText('Test Notification')).toBeInTheDocument();

    const clearButton = screen.getByText('Clear Notifications');
    act(() => {
      clearButton.click();
    });
    expect(screen.queryByText('Test Notification')).not.toBeInTheDocument();
  });

  it('should automatically close notifications after a timeout', () => {
    jest.useFakeTimers();

    render(
      <NotificationsProvider>
        <DummyComponent />
      </NotificationsProvider>
    );

    const addButton = screen.getByText('Add Notification');
    act(() => {
      addButton.click();
    });

    expect(screen.getByText('Test Notification')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(8001); // Advance time by 8 seconds
    });
    expect(screen.queryByText('Test Notification')).not.toBeInTheDocument();
  });

  it('should work with externally created store', () => {
    const store = createStore();

    render(
      <NotificationsProvider store={store}>
        <DummyComponent />
      </NotificationsProvider>
    );

    const addButton = screen.getByText('Add Notification');
    act(() => {
      addButton.click();
    });

    expect(screen.getByText('Test Notification')).toBeInTheDocument();

    act(() => {
      screen.getByLabelText('close-notification').click();
    });
    expect(screen.queryByText('Test Notification')).not.toBeInTheDocument();
  });
});
