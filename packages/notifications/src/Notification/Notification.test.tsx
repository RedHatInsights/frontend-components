import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Notification, { NotificationProps } from './Notification';
import { AlertVariant } from '@patternfly/react-core';

describe('Notification component', () => {
  let initialProps: NotificationProps;
  beforeEach(() => {
    initialProps = {
      id: 'Foo',
      title: 'Bar',
      description: 'description',
      dismissable: false,
      onDismiss: jest.fn(),
      variant: AlertVariant.success,
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<Notification {...initialProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('pagination should render correctly', () => {
    const wrapper = shallow(<Notification {...initialProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly withouth description', () => {
    const wrapper = shallow(<Notification {...initialProps} description={undefined} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with sentryId', () => {
    const wrapper = shallow(<Notification {...initialProps} sentryId={'some-UUID'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with HTML description', () => {
    const description = '<html><body><h1>Some text</h1><div>another</div></body><img src="some" /></html>';
    const wrapper = shallow(<Notification {...initialProps} description={description} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with HTML title', () => {
    const title = '<html><body><h1>Some text</h1><div>another</div></body><img src="some" /></html>';
    const wrapper = shallow(<Notification {...initialProps} title={title} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with dismiss button', () => {
    const wrapper = shallow(<Notification {...initialProps} description={undefined} dismissable />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call dismiss function on action click', () => {
    const onDismiss = jest.fn();
    const wrapper = mount(<Notification {...initialProps} onDismiss={onDismiss} description={undefined} dismissable />);
    wrapper.find('button').simulate('click');
    expect(onDismiss).toHaveBeenCalledWith(initialProps.id);
  });

  it('should call dismiss function when timer runs out', () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    const wrapper = mount(<Notification dismissDelay={100} {...initialProps} onDismiss={onDismiss} description={undefined} />);
    jest.advanceTimersByTime(100);
    wrapper.update();
    expect(onDismiss).toHaveBeenCalledWith('Foo');
  });

  it('should clear interval on notification unmout', () => {
    const timeoutSpy = jest.spyOn(global, 'clearTimeout');
    timeoutSpy.mockReset();
    let wrapper = mount(<Notification dismissDelay={100} {...initialProps} description={undefined} />);
    wrapper.unmount();
    expect(timeoutSpy).toHaveBeenCalledTimes(1);
    timeoutSpy.mockRestore();

    wrapper = mount(<Notification dismissDelay={100} {...initialProps} dismissable description={undefined} />);
    expect(timeoutSpy).not.toHaveBeenCalled();
    timeoutSpy.mockRestore();
  });

  it('should clear timeout on notification mouse enter', () => {
    const timeoutSpy = jest.spyOn(global, 'clearTimeout');
    timeoutSpy.mockReset();
    let wrapper;
    act(() => {
      wrapper = mount(<Notification dismissDelay={100} {...initialProps} description={undefined} />);
    });
    // @ts-ignore
    wrapper?.find('.pf-c-alert').simulate('mouseEnter');
    expect(timeoutSpy).toHaveBeenCalledTimes(1);
    timeoutSpy.mockRestore();
  });

  it('should set timeout on notification mouse leave', async () => {
    const timeoutSpy = jest.spyOn(global, 'setTimeout');
    let wrapper;
    act(() => {
      timeoutSpy.mockReset();
      wrapper = mount(<Notification dismissDelay={100} {...initialProps} description={undefined} />);
    });
    // @ts-ignore
    wrapper?.find('.pf-c-alert').simulate('mouseLeave');
    expect(timeoutSpy).toHaveBeenCalledTimes(3);
    timeoutSpy.mockRestore();
  });
});
