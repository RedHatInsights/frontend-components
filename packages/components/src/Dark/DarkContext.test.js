import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Dark from './Dark';
import DarkContext from './DarkContext';

describe('DarkContext', () => {
  it('should render children', () => {
    const wrapper = shallow(
      <Dark>
        <div id="isPresent" />
      </Dark>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.exists('#isPresent')).toBeTruthy();
  });

  it('should pass props', () => {
    const wrapper = mount(
      <Dark>
        <DarkContext.Consumer>{(value) => <div value={value} id="consumer" />}</DarkContext.Consumer>
      </Dark>
    );
    expect(wrapper.find('#consumer').props()).toEqual(expect.objectContaining({ value: 'dark' }));
  });
});
