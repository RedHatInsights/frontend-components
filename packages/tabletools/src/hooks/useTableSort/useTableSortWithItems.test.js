import { renderHook } from '@testing-library/react-hooks';
import useTableSortWithItems from './useTableSortWithItems';
import columns from '../__fixtures__/columns';

describe('useTableSortWithItems', () => {
  it('returns no sortBy when there are no items', () => {
    const sortBy = {
      index: 3,
      direction: 'asc',
    };
    const { result } = renderHook(() =>
      useTableSortWithItems([], columns, {
        sortBy,
      })
    );
    expect(result.current.tableProps.sortBy).toEqual(undefined);
  });
});
