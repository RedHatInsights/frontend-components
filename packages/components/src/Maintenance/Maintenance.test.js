import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Maintenance from './Maintenance';

describe('Maintenance component', () => {
  it('should render with default props', () => {
    const wrapper = shallow(<Maintenance />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with times', () => {
    const wrapper = shallow(<Maintenance startTime="12am" endTime="2am" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with new description', () => {
    const wrapper = shallow(<Maintenance description={<span> test </span>} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
