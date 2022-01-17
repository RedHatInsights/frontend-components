import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Section from './Section';

describe('Section component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Section type="page">Test</Section>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
