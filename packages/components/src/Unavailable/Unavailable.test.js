import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Unavailable from './Unavailable';

describe('Unavailable component', () => {
  it('should render', () => {
    const wrapper = mount(<Unavailable />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
