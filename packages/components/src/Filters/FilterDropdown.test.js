import React from 'react';
import FilterDropdown from './FilterDropdown';
import { render } from '@testing-library/react';

describe('FilterDropdown component', () => {
  const defaultProps = {
    filters: {},
    addFilter: jest.fn(),
    removeFilter: jest.fn(),
    filterCategories: [{ title: '', type: '', urlParam: '', values: [{ label: '', value: '' }] }],
  };

  it('should render', () => {
    const { container } = render(<FilterDropdown {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should render with a component as label', () => {
    const { container } = render(<FilterDropdown {...defaultProps} label={<React.Fragment />} />);
    expect(container).toMatchSnapshot();
  });
});
