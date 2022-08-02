import { act, renderHook } from '@testing-library/react-hooks';
import usePagination from './usePagination';

describe('usePagination', () => {
  it('returns a paginate configuration', () => {
    const { result } = renderHook(() => usePagination());
    expect(result).toMatchSnapshot();
  });

  it('returns a paginate configuration', () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.toolbarProps.pagination.page).toBe(2);
  });
});
