import { renderHook } from '@testing-library/react-hooks';
import useBulkSelect from './useBulkSelect';
import items from './__fixtures__/items';

describe('useBulkSelect', () => {
    const exampleItems = items(20);

    it('returns a bulk select configuration', () => {
        const options = {
            onSelect: () => ({}),
            items: exampleItems
        };

        const { result } = renderHook(() => useBulkSelect(options));

        expect(result).toMatchSnapshot();
    });
});
