import React from 'react';
import NoRegisteredSystems from './NoRegisteredSystems';
import { render } from '@testing-library/react';

describe('Not connected component', () => {
  it('should render', () => {
    const { container } = render(<NoRegisteredSystems />);
    expect(container).toMatchSnapshot();
  });
});
