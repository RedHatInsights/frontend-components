import React from 'react';
import Maintenance from './Maintenance';
import { render } from '@testing-library/react';

describe('Maintenance component', () => {
  it('should render with default props', () => {
    const { container, getByText } = render(<Maintenance />);
    expect(getByText('unavailable from 10am to 12am UTC (6am-8am EST).').textContent).toBe('unavailable from 10am to 12am UTC (6am-8am EST).');
    expect(container).toMatchSnapshot();
  });

  it('should render with times', () => {
    const { container, getByText } = render(<Maintenance startTime="12am" endTime="2am" />);
    expect(getByText('unavailable from 10am to 12am UTC (12am-2am EST).').textContent).toBe('unavailable from 10am to 12am UTC (12am-2am EST).');
    expect(container).toMatchSnapshot();
  });

  it('should render with new description', () => {
    const { container } = render(<Maintenance description={<span> test </span>} />);
    expect(container).toMatchSnapshot();
  });
});
