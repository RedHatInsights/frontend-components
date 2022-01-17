import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import RowLoader from './RowLoader';

describe('RowLoader', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<RowLoader />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
