import CriticalIcon from './CriticalIcon';
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('CriticalIcon component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<CriticalIcon />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
