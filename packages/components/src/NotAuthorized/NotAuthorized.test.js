import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import NotAuthorized from './NotAuthorized';

describe('NotAuthorized component', () => {
  const initialProps = {
    serviceName: 'Foo',
  };
  it('should render', () => {
    const wrapper = shallow(<NotAuthorized {...initialProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should apply custom styles', () => {
    const wrapper = shallow(<NotAuthorized {...initialProps} className="something" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should use custom icon', () => {
    const wrapper = mount(<NotAuthorized {...initialProps} icon={() => 'some Icon!'} />);
    expect(toJson(wrapper, { mode: 'deep' })).toMatchSnapshot();
  });

  it('should not show buttons', () => {
    const wrapper = shallow(<NotAuthorized {...initialProps} showReturnButton={false} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should show custom description', () => {
    const wrapper = shallow(<NotAuthorized {...initialProps} description="Some text" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should show custom title', () => {
    const wrapper = shallow(<NotAuthorized title="Custom title" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should show custom actions', () => {
    const actions = [
      <button id="action-one" key="1">
        1
      </button>,
      <button id="action-one" key="2">
        2
      </button>,
    ];
    const wrapper = shallow(<NotAuthorized {...initialProps} actions={actions} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
