import React from 'react';
import EmptyTable from './EmptyTable';
import { render } from '@testing-library/react';

describe('EmptyTable component', () => {
  it('should render', () => {
    const { container } = render(<EmptyTable>Some</EmptyTable>);
    expect(container).toMatchSnapshot();
  });

  it('should render with centered children', () => {
    const { container } = render(<EmptyTable centered>Centered</EmptyTable>);
    expect(container).toMatchSnapshot();
  });
});
