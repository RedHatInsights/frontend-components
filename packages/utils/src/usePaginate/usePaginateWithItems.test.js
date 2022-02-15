import { act, renderHook } from '@testing-library/react-hooks';
import usePaginateWithItems from './usePaginateWithItems';
import items from '../__fixtures__/items';

describe('usePaginateWithItems', () => {
  it('returns a paginate configuration', () => {
    const { result } = renderHook(() => usePaginateWithItems());
    expect(result).toMatchSnapshot();
  });

  it('returns a paginate configuration', () => {
    const exampleItems = items(40);
    const { result } = renderHook(() => usePaginateWithItems({ perPage: 5 }));

    act(() => {
      result.current.setPage(2);
    });

    const paginatedItems = result.current.paginator(exampleItems);

    expect(paginatedItems).toMatchSnapshot();
    expect(paginatedItems.length).toBe(5);
    expect(paginatedItems[4]).toBe(exampleItems[9]);
  });
});
