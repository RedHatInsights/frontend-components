import React from 'react';
import SortBy from './SortBy';
import { render } from '@testing-library/react';

describe('PrimaryToolbar', () => {
  describe('should render', () => {
    it('no data', () => {
      const { container } = render(<SortBy />);
      expect(container).toMatchSnapshot();
    });

    it('desc direction', () => {
      const { container } = render(<SortBy direction="desc" />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should NOT call changeDirection', () => {
      const onSortChange = jest.fn();
      const { container } = render(<SortBy />);
      container.querySelector('button').click();
      expect(onSortChange).not.toHaveBeenCalled();
    });

    it('should call changeDirection - desc', () => {
      const onSortChange = jest.fn();
      const { container } = render(<SortBy onSortChange={onSortChange} />);
      container.querySelector('button').click();
      expect(onSortChange).toHaveBeenCalled();
      expect(onSortChange.mock.calls[0][1]).toBe('desc');
    });

    it('should call changeDirection - desc', () => {
      const onSortChange = jest.fn();
      const { container } = render(<SortBy onSortChange={onSortChange} direction="desc" />);
      container.querySelector('button').click();
      expect(onSortChange).toHaveBeenCalled();
      expect(onSortChange.mock.calls[0][1]).toBe('asc');
    });
  });
});
