import React from 'react';
import Maintenance from './Maintenance';
import { render } from '@testing-library/react';

describe('Maintenance component', () => {
  it('should render with default props', () => {
    const { container } = render(<Maintenance />);
    expect(container).toMatchSnapshot();
  });

  it('should render with times', () => {
    const { container } = render(<Maintenance startTime="12am" endTime="2am" />);
    expect(container).toMatchSnapshot();
  });

  it('should render with new description', () => {
    const { container } = render(<Maintenance description={<span> test </span>} />);
    expect(container).toMatchSnapshot();
  });
});
