import { act, renderHook } from '@testing-library/react-hooks';
import usePaginationWithItems from './usePaginationWithItems';
import items from '../__fixtures__/items';

describe('usePaginationWithItems', () => {
  it('returns a paginate configuration', () => {
    const { result } = renderHook(() => usePaginationWithItems());
    expect(result).toMatchSnapshot();
  });

  it('returns a paginate configuration', () => {
    const exampleItems = items(40);
    const { result } = renderHook(() => usePaginationWithItems({ perPage: 5 }));

    act(() => {
      result.current.setPage(2);
    });

    const paginatedItems = result.current.paginator(exampleItems);

    expect(paginatedItems).toMatchSnapshot();
    expect(paginatedItems.length).toBe(5);
    expect(paginatedItems[4]).toBe(exampleItems[9]);
  });
});
