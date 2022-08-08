import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import NoRegisteredSystems from './NoRegisteredSystems';

describe('Not connected component', () => {
  it('should render', () => {
    const wrapper = mount(<NoRegisteredSystems />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
