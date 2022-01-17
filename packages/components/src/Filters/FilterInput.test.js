import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import FilterInput from './FilterInput';

describe('FilterInput component', () => {
  it('should render a radio input', () => {
    const wrapper = shallow(
      <FilterInput
        aria-label="label"
        id="id"
        label="label"
        addRemoveFilters={jest.fn()}
        param="param"
        type="radio"
        value="value"
        filters={{ param: 'value' }}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should render a checkbox input', () => {
    const wrapper = shallow(
      <FilterInput aria-label="label" id="id" label="label" addRemoveFilters={jest.fn()} param="param" type="checkbox" value="value" />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
