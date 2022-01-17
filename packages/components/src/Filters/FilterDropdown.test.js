import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import FilterDropdown from './FilterDropdown';

describe('FilterDropdown component', () => {
  const defaultProps = {
    filters: {},
    addFilter: jest.fn(),
    removeFilter: jest.fn(),
    filterCategories: [{ title: '', type: '', urlParam: '', values: [{ label: '', value: '' }] }],
  };

  it('should render', () => {
    const wrapper = shallow(<FilterDropdown {...defaultProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with a component as label', () => {
    const wrapper = shallow(<FilterDropdown {...defaultProps} label={<React.Fragment />} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
