import React from 'react';
import NotificationPagination from './NotificationPagination';
import { act, render, screen } from '@testing-library/react';

describe('Notification Pagination component', () => {
  it('should render correctly', () => {
    const { container } = render(<NotificationPagination page={1} count={10} />);
    expect(container).toMatchSnapshot();
  });

  it('render should contain correct items', () => {
    const { container } = render(<NotificationPagination page={1} count={10} />);
    expect(container.querySelectorAll('.pf-v5-c-pagination.pf-m-bottom').length).toBe(1);
    expect(container.querySelectorAll('.pf-v5-c-pagination__nav').length).toBe(1);
  });

  it('should call clear all action', () => {
    const onClearAll = jest.fn();
    render(<NotificationPagination page={1} count={10} onClearAll={onClearAll} />);
    act(() => {
      screen.getByText('Clear all').click();
    });
    expect(onClearAll).toHaveBeenCalled();
  });

  it('should call next page action', () => {
    const onSetPage = jest.fn();
    render(<NotificationPagination page={1} count={10} onSetPage={onSetPage} />);
    act(() => {
      screen.getByLabelText('Go to next page').click();
    });
    expect(onSetPage).toHaveBeenCalled();
  });
});
