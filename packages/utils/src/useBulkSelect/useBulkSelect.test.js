import { renderHook } from '@testing-library/react-hooks';
import useBulkSelect from './useBulkSelect';

describe('useBulkSelect', () => {
  const defaultOptions = {
    total: 0,
    onSelect: () => ({}),
    itemIdsInTable: () => [],
    itemIdsOnPage: () => [],
  };

  it('returns a bulk select configuration', () => {
    const { result } = renderHook(() => useBulkSelect(defaultOptions));

    expect(result).toMatchSnapshot();
  });

  it('returns a bulk select configuration with the correct options', () => {
    const { result } = renderHook(() =>
      useBulkSelect({
        ...defaultOptions,
        total: 2,
        preselected: ['ID'],
        itemIdsInTable: () => {
          return ['ID', 'ID1'];
        },
        itemIdsOnPage: () => ['ID', 'ID1'],
      })
    );

    expect(result.current).toMatchSnapshot();
  });

  it('returns a bulk select configuration with the correct options', () => {
    const { result } = renderHook(() =>
      useBulkSelect({
        ...defaultOptions,
        total: 2,
        preselected: ['ID'],
        itemIdsInTable: () => ['ID', 'ID2'],
        itemIdsOnPage: () => ['ID', 'ID2'],
      })
    );

    expect(result.current).toMatchSnapshot();
  });

  it('returns a bulk select configuration with the correct options', () => {
    const { result } = renderHook(() =>
      useBulkSelect({
        ...defaultOptions,
        total: 2,
        preselected: ['ID'],
        itemIdsInTable: () => ['ID', 'ID2'],
        itemIdsOnPage: () => ['ID'],
      })
    );

    expect(result.current).toMatchSnapshot();
  });
});
