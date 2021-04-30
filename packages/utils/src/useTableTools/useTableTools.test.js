import { renderHook } from '@testing-library/react-hooks';
import useTableTools from './useTableTools';
import items from './__fixtures__/items';
import columns from './__fixtures__/columns';
import filters from './__fixtures__/filters';

describe('useTableTools', () => {
    const exampleItems = items(30).sort((item) => (item.name));
    const defaultArguments = [ exampleItems, columns ];

    it('returns a tableProps and toolbarProps', () => {
        const { result } = renderHook(() => useTableTools(...defaultArguments));
        expect(result.current.tableProps).not.toBeUndefined();
        expect(result.current.toolbarProps).not.toBeUndefined();
    });

    it('returns default pagintated rows', () => {
        const { result } = renderHook(() => useTableTools(...defaultArguments));
        expect(result.current.tableProps.rows.length).toBe(10);
        expect(result.current.tableProps.rows).toMatchSnapshot();
    });

    it('returns perPage amount of items as rows', () => {
        const { result } = renderHook(() => useTableTools(...defaultArguments, {
            perPage: 20
        }));
        expect(result.current.tableProps.rows.length).toBe(20);
    });

    it('returns all items as rows with pagination disabled', () => {
        const { result } = renderHook(() => useTableTools(...defaultArguments, {
            pagination: false
        }));
        expect(result.current.tableProps.rows.length).toBe(exampleItems.length);
    });

    it('returns toolbarProps and tableProps for bulk select when onSelect is passed', () => {
        const { result } = renderHook(() => useTableTools(...defaultArguments, {
            onSelect: () => ({})
        }));
        expect(result.current.tableProps.onSelect).not.toBeUndefined();
        expect(result.current.tableProps.canSelectAll).not.toBeUndefined();
        expect(result.current.toolbarProps.bulkSelect).not.toBeUndefined();
    });

    it('returns toolbarProps and tableProps for filters when a filter config is passed', () => {
        const { result } = renderHook(() => useTableTools(...defaultArguments, {
            filterConfig: filters
        }));
        expect(result.current.toolbarProps).toMatchSnapshot();
        expect(result.current.toolbarProps.filterConfig).not.toBeUndefined();
        expect(result.current.toolbarProps.activeFiltersConfig).not.toBeUndefined();
    });
});
