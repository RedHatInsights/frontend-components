import React from 'react';
import TableToolbar from './TableToolbar';
import { render } from '@testing-library/react';

describe('TableToolbar component', () => {
  it('should render', () => {
    const { container } = render(<TableToolbar>Some</TableToolbar>);
    expect(container).toMatchSnapshot();
  });

  it('should render with results of 0', () => {
    const { container } = render(<TableToolbar results={0}>Some</TableToolbar>);
    expect(container).toMatchSnapshot();
  });

  it('should render with results of 1', () => {
    const { container } = render(<TableToolbar results={1}>Some</TableToolbar>);
    expect(container).toMatchSnapshot();
  });

  it('should render with results greater than 1', () => {
    const { container } = render(<TableToolbar results={2}>Some</TableToolbar>);
    expect(container).toMatchSnapshot();
  });

  it('should render with selection of 0', () => {
    const { container } = render(<TableToolbar selected={0}>Some</TableToolbar>);
    expect(container).toMatchSnapshot();
  });

  it('should render with selection of 1', () => {
    const { container } = render(<TableToolbar selected={1}>Some</TableToolbar>);
    expect(container).toMatchSnapshot();
  });

  it('should render with results and selection of 1', () => {
    const { container } = render(
      <TableToolbar results={1} selected={1}>
        Some
      </TableToolbar>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render a footer', () => {
    const { container } = render(<TableToolbar isFooter>Footer</TableToolbar>);
    expect(container).toMatchSnapshot();
  });

  it.each([0, 1, 2])('preserves provider-free English selection text for %s', (selected) => {
    const { container } = render(<TableToolbar selected={selected} />);
    expect(container.querySelector('.ins-c-table__toolbar-results-selected').textContent).toBe(` ${selected} Selected `);
  });
});
