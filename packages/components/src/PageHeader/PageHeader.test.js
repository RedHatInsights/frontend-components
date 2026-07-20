import React from 'react';
import PageHeader from './PageHeader';
import { render } from '@testing-library/react';

describe('PageHeader component', () => {
  it('should render', () => {
    const { container } = render(<PageHeader>Something</PageHeader>);
    expect(container).toMatchSnapshot();
  });
});
