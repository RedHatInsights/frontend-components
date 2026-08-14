import React from 'react';
import Reboot from './Reboot';
import { render } from '@testing-library/react';

describe('Reboot component', () => {
  it('should render correctly', () => {
    const { container } = render(<Reboot />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with red', () => {
    const { container } = render(<Reboot red />);
    expect(container).toMatchSnapshot();
  });
});
