import React from 'react';
import Skeleton, { SkeletonSize } from './Skeleton';
import { render } from '@testing-library/react';

describe('Skeleton component', () => {
  Object.values(SkeletonSize).forEach((size) => {
    it(`should render correctly - ${size}`, () => {
      const { container } = render(<Skeleton size={size} />);
      expect(container).toMatchSnapshot();
    });
  });

  it('should render correctly without size', () => {
    const { container } = render(<Skeleton />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly as dark', () => {
    const { container } = render(<Skeleton isDark />);
    expect(container).toMatchSnapshot();
  });
});
