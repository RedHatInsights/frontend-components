import { act, renderHook } from '@testing-library/react-hooks';
import usePaginate from './usePaginate';

describe('usePaginate', () => {
  it('returns a paginate configuration', () => {
    const { result } = renderHook(() => usePaginate());
    expect(result).toMatchSnapshot();
  });

  it('returns a paginate configuration', () => {
    const { result } = renderHook(() => usePaginate());

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.toolbarProps.pagination.page).toBe(2);
  });
});
