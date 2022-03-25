import { renderHook, act } from '@testing-library/react-hooks';
import { identifyItems } from '../helpers';
import items from '../__fixtures__/items';
import useBulkSelectWithItems from './useBulkSelectWithItems';

describe('useBulkSelectWithItems', () => {
  const exampleItems = identifyItems(items(20));
  const defaultOptions = {
    onSelect: () => ({}),
    items: exampleItems,
    perPage: 10,
    preselected: [],
  };
  const getBulkSelect = (result) => result.current.toolbarProps.bulkSelect;
  const getSelectNone = (result) => result.current.toolbarProps.bulkSelect.items[0];
  const getSelectPage = (result) => result.current.toolbarProps.bulkSelect.items[1];
  const getSelectAll = (result) => result.current.toolbarProps.bulkSelect.items[2];

  it('returns a bulk select configuration', () => {
    const { result } = renderHook(() => useBulkSelectWithItems(defaultOptions));

    expect(result).toMatchSnapshot();
  });

  it('returns a allows to select one', async () => {
    const item = exampleItems[5];
    const { result } = renderHook(() => useBulkSelectWithItems(defaultOptions));

    act(() => {
      result.current.tableProps.onSelect(undefined, true, 'itemId', item);
    });

    expect(result.current.transformer(item)).toMatchSnapshot();
  });

  it('returns a allows to select/deselect all', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useBulkSelectWithItems(defaultOptions));
    expect(getBulkSelect(result)).toMatchSnapshot();

    act(() => {
      getSelectAll(result).onClick();
    });

    await waitForNextUpdate();
    expect(getBulkSelect(result)).toMatchSnapshot();

    act(() => {
      getSelectAll(result).onClick();
    });
    await waitForNextUpdate();
    expect(getBulkSelect(result)).toMatchSnapshot();
  });

  it('returns a allows to select/deselect page', async () => {
    const { result } = renderHook(() => useBulkSelectWithItems(defaultOptions));
    expect(getBulkSelect(result)).toMatchSnapshot();

    act(() => {
      getSelectPage(result).onClick();
    });

    expect(getBulkSelect(result)).toMatchSnapshot();

    act(() => {
      getSelectPage(result).onClick();
    });

    expect(getBulkSelect(result)).toMatchSnapshot();
  });

  it('returns respects filtered results', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useBulkSelectWithItems({
        ...defaultOptions,
        filter: (items) => items.slice(5, 10),
      })
    );
    expect(getBulkSelect(result)).toMatchSnapshot();

    act(() => {
      getSelectAll(result).onClick();
    });

    await waitForNextUpdate();
    expect(getBulkSelect(result)).toMatchSnapshot();
  });
});
