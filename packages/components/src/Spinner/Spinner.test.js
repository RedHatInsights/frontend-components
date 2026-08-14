import React from 'react';
import Spinner from './Spinner';
import { render } from '@testing-library/react';

describe('Spinner component', () => {
  it('should render', () => {
    const { container } = render(<Spinner />);
    expect(container).toMatchSnapshot();
  });

  it('should render center Spinner', () => {
    const { container } = render(<Spinner centered />);
    expect(container).toMatchSnapshot();
  });
});
