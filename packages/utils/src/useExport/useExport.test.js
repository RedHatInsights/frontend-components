import { act, renderHook } from '@testing-library/react-hooks';
import columns from '../__fixtures__/columns';
import items from '../__fixtures__/items';
import useExport from './useExport';

const exampleItems = items(25);

describe('useExport', () => {
  const exporter = jest.fn(() => Promise.resolve(exampleItems));
  const defaultOptions = {
    exporter,
    columns,
  };

  it('returns an export config toolbar config', () => {
    const { result } = renderHook(() => useExport(defaultOptions));
    expect(result.current.toolbarProps.exportConfig).toBeDefined();
    expect(result).toMatchSnapshot();
  });

  it('returns an export config toolbar config', () => {
    const { result } = renderHook(() =>
      useExport({
        ...defaultOptions,
        isDisabled: true,
      })
    );
    expect(result.current.toolbarProps.exportConfig.isDisabled).toBe(true);
  });

  it('calls the exporter via onSelect', () => {
    const { result } = renderHook(() => useExport(defaultOptions));

    act(() => {
      result.current.toolbarProps.exportConfig.onSelect(null, 'csv');
    });

    expect(exporter).toHaveBeenCalled();

    act(() => {
      result.current.toolbarProps.exportConfig.onSelect(null, 'json');
    });

    expect(exporter).toHaveBeenCalled();
  });
});
