import InsightsLabel from './InsightsLabel';
import React from 'react';
import { render } from '@testing-library/react';

describe('InsightsLabel component', () => {
  it('should render with icon', () => {
    const { container } = render(<InsightsLabel value={1} />);
    expect(container).toMatchSnapshot();
  });
  it('should render without icon', () => {
    const { container } = render(<InsightsLabel value={1} hideIcon />);
    expect(container).toMatchSnapshot();
  });
  it('should render defaults', () => {
    const { container } = render(<InsightsLabel />);
    expect(container).toMatchSnapshot();
  });
});
