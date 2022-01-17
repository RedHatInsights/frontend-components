import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Spinner from './Spinner';

describe('Spinner component', () => {
  it('should render', () => {
    const wrapper = shallow(<Spinner />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render center Spinner', () => {
    const wrapper = shallow(<Spinner centered />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
