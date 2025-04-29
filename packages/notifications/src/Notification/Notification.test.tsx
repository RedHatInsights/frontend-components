import { act, render, screen } from '@testing-library/react';
import Notification, { NotificationProps } from './Notification';
import { AlertVariant } from '@patternfly/react-core/dist/dynamic/components/Alert';
import userEvent from '@testing-library/user-event';

describe('Notification component', () => {
  let initialProps: NotificationProps;
  beforeEach(() => {
    initialProps = {
      // We need a deterministic string, not random UUID
      // @ts-ignore
      id: 'Foo',
      title: 'Bar',
      description: 'description',
      dismissable: false,
      onDismiss: jest.fn(),
      variant: AlertVariant.success,
    };
  });

  it('should render correctly', () => {
    const { container } = render(<Notification {...initialProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly without description', () => {
    const { container } = render(<Notification {...initialProps} description={undefined} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with sentryId', () => {
    const { container } = render(<Notification {...initialProps} sentryId={'some-UUID'} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with HTML description', () => {
    const description = '<html><body><h1>Some text</h1><div>another</div></body><img src="some" /></html>';
    const { container } = render(<Notification {...initialProps} description={description} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with HTML title', () => {
    const title = '<html><body><h1>Some text</h1><div>another</div></body><img src="some" /></html>';
    const { container } = render(<Notification {...initialProps} title={title} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with dismiss button', () => {
    const { container } = render(<Notification {...initialProps} description={undefined} dismissable />);
    expect(container).toMatchSnapshot();
  });

  it('should call dismiss function on action click', () => {
    const onDismiss = jest.fn();
    render(<Notification {...initialProps} onDismiss={onDismiss} description={undefined} dismissable />);
    screen.getByRole('button').click();
    expect(onDismiss).toHaveBeenCalledWith(initialProps.id);
  });

  it('should call dismiss function when timer runs out', () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    render(<Notification dismissDelay={100} {...initialProps} onDismiss={onDismiss} description={undefined} />);
    jest.advanceTimersByTime(100);
    expect(onDismiss).toHaveBeenCalledWith('Foo');
  });

  it('should clear interval on notification unmout', () => {
    const timeoutSpy = jest.spyOn(global, 'clearTimeout');
    timeoutSpy.mockReset();
    const { unmount } = render(<Notification dismissDelay={100} {...initialProps} description={undefined} />);
    unmount();
    expect(timeoutSpy).toHaveBeenCalledTimes(1);
    timeoutSpy.mockRestore();

    render(<Notification dismissDelay={100} {...initialProps} dismissable description={undefined} />);
    expect(timeoutSpy).not.toHaveBeenCalled();
    timeoutSpy.mockRestore();
  });

  it('should clear timeout on notification mouse enter', () => {
    const timeoutSpy = jest.spyOn(global, 'clearTimeout');
    timeoutSpy.mockReset();
    act(() => {
      render(<Notification dismissDelay={100} {...initialProps} description={undefined} />);
    });
    act(() => {
      userEvent.hover(screen.getByText('Bar'));
    });
    expect(timeoutSpy).toHaveBeenCalledTimes(1);
    timeoutSpy.mockRestore();
  });

  it('should set timeout on notification mouse leave', async () => {
    const timeoutSpy = jest.spyOn(global, 'setTimeout');
    timeoutSpy.mockReset();
    act(() => {
      render(<Notification dismissDelay={100} {...initialProps} description={undefined} />);
    });
    act(() => {
      userEvent.hover(screen.getByText('Bar'));
    });
    act(() => {
      userEvent.unhover(screen.getByText('Bar'));
    });
    expect(timeoutSpy).toHaveBeenCalledTimes(3);
    timeoutSpy.mockRestore();
  });
});
