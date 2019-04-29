import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Notification from './Notification';

describe('Notification component', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {
      id: 'Foo',
      title: 'Bar',
      description: 'description',
      dismissable: false,
      onDismiss: jest.fn(),
      variant: 'success'
    }
  })

  it('should render correctly', () => {
    const wrapper = shallow(<Notification {...initialProps}/>)
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly withouth description', () => {
    const wrapper = shallow(<Notification {...initialProps} description={undefined}/>)
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  
  it('should render correctly with HTML description', () => {
      const description = '<html><body><h1>Some text</h1><div>another</div></body><img src="some" /></html>';
      const wrapper = shallow(<Notification {...initialProps} description={description} />)
      expect(toJson(wrapper)).toMatchSnapshot();
  });

    it('should render correctly with HTML title', () => {
        const title = '<html><body><h1>Some text</h1><div>another</div></body><img src="some" /></html>';
        const wrapper = shallow(<Notification {...initialProps} title={title} />)
        expect(toJson(wrapper)).toMatchSnapshot();
    });

  it('should render correctly with dismiss button', () => {
    const wrapper = shallow(<Notification {...initialProps} description={undefined} dismissable/>)
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call dismiss function on action click', () => {
    const onDismiss = jest.fn();
    const wrapper = mount(<Notification {...initialProps} onDismiss={ onDismiss } description={undefined} dismissable/>);
    wrapper.find('button').simulate('click');
    expect(onDismiss).toHaveBeenCalledWith(initialProps.id);
  });

  it('should call dismiss function when timer runs out', (done) => {
    const onDismiss = jest.fn();
    const wrapper = mount(<Notification dismissDelay={100} {...initialProps} onDismiss={ onDismiss } description={undefined}/>);
    setTimeout(() => {
      wrapper.update()
      expect(onDismiss).toHaveBeenCalledWith('Foo');
      done();
    }, 101)
  });

  it('should clear interval on notification unmout', () => {
    const timeoutSpy = jest.spyOn(global, 'clearTimeout');
    let wrapper = mount(<Notification dismissDelay={100} {...initialProps} description={undefined}/>);
    wrapper.unmount();
    expect(timeoutSpy).toHaveBeenCalledTimes(1);
    timeoutSpy.mockRestore()

    wrapper = mount(<Notification dismissDelay={100} {...initialProps} dismissable description={undefined}/>);
    expect(timeoutSpy).not.toHaveBeenCalled();
  });
});
