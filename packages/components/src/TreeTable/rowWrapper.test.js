import React from 'react';
import RowWrapper from './rowWrapper';
import { render } from '@testing-library/react';

describe('TreeTable RowWrapper', () => {
  it('should render correctly - no data', () => {
    const { container } = render(<RowWrapper />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly - with data', () => {
    const { container } = render(
      <RowWrapper
        row={{
          level: 0,
          isTreeOpen: true,
          point: { size: 2 },
          posinset: 1,
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly - with data collapsed', () => {
    const { container } = render(
      <RowWrapper
        row={{
          level: 0,
          isTreeOpen: false,
          point: { size: 2 },
          posinset: 1,
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
