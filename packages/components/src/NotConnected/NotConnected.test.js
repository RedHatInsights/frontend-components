import React from 'react';
import NotConnected from './NotConnected';
import { render } from '@testing-library/react';

describe('Not connected component', () => {
  it('should render', () => {
    const { container } = render(<NotConnected />);
    expect(container).toMatchSnapshot();
  });
});
