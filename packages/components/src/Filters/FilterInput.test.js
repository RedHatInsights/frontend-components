import React from 'react';
import FilterInput from './FilterInput';
import { render } from '@testing-library/react';

describe('FilterInput component', () => {
  it('should render a radio input', () => {
    const { container } = render(
      <FilterInput
        aria-label="label"
        id="id"
        label="label"
        addRemoveFilters={jest.fn()}
        param="param"
        type="radio"
        value="value"
        filters={{ param: 'value' }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render a checkbox input', () => {
    const { container } = render(
      <FilterInput aria-label="label" id="id" label="label" addRemoveFilters={jest.fn()} param="param" type="checkbox" value="value" />,
    );
    expect(container).toMatchSnapshot();
  });
});
