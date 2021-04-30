import { act, renderHook } from '@testing-library/react-hooks';
import usePaginate from './usePaginate';
import items from './__fixtures__/items';

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

        expect(result.current.pagination.page).toBe(2);
    });

    it('returns a paginate configuration', () => {
        const exampleItems = items(40);
        const { result } = renderHook(() => usePaginate({ perPage: 5 }));

        act(() => {
            result.current.setPage(2);
        });

        const paginatedItems = result.current.paginator(exampleItems);

        expect(paginatedItems).toMatchSnapshot();
        expect(paginatedItems.length).toBe(5);
        expect(paginatedItems[4]).toBe(exampleItems[9]);
    });
});
