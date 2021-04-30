import { renderHook } from '@testing-library/react-hooks';
import useTableSort from './useTableSort';
import items from './__fixtures__/items';
import columns from './__fixtures__/columns';

describe('useTableSort', () => {
    const exampleItems = items(100);

    it('returns a table sort configuration', () => {
        const { result } = renderHook(() => useTableSort(columns));
        expect(result).toMatchSnapshot();
    });
});
