import React from 'react';
import Shield from './Shield';
import { render } from '@testing-library/react';

describe('Shield component', () => {
  it('should render without props', () => {
    const { container } = render(<Shield />);
    expect(container).toMatchSnapshot();
  });

  it('should render where impact value is undefined', () => {
    const { container } = render(<Shield impact={undefined} />);
    expect(container).toMatchSnapshot();
  });

  it('should render where impact value is empty string', () => {
    const { container } = render(<Shield impact={''} />);
    expect(container).toMatchSnapshot();
  });

  it('should render where impact value is Low', () => {
    const { container } = render(<Shield impact={'Low'} />);
    expect(container).toMatchSnapshot();
  });

  it('should render where impact value is Critical', () => {
    const { container } = render(<Shield impact={'Critical'} />);
    expect(container).toMatchSnapshot();
  });

  it('should render where impact value is 4', () => {
    const { container } = render(<Shield impact={4} />);
    expect(container).toMatchSnapshot();
  });

  it('should render where impact value is 3', () => {
    const { container } = render(<Shield impact={3} />);
    expect(container).toMatchSnapshot();
  });

  it('should render where impact value is 2', () => {
    const { container } = render(<Shield impact={2} />);
    expect(container).toMatchSnapshot();
  });

  it('should render where impact value is 1', () => {
    const { container } = render(<Shield impact={1} />);
    expect(container).toMatchSnapshot();
  });

  it('should render where impact value is NonExist', () => {
    const { container } = render(<Shield impact={'NonExist'} />);
    expect(container).toMatchSnapshot();
  });

  it('should render with label', () => {
    const { container } = render(<Shield impact={'Medium'} hasLabel />);
    expect(container).toMatchSnapshot();
  });

  it('should render where hasTooltip is false', () => {
    const { container } = render(<Shield hasTooltip={false} />);
    expect(container).toMatchSnapshot();
  });
});
