import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Reboot from './Reboot';

describe('Reboot component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Reboot />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with red', () => {
    const wrapper = shallow(<Reboot red />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
