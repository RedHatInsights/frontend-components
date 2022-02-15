import useExport from './useExport';

export const useExportWithItems = (items, columns, options = {}) => {
  const exportEnabled = options?.exportable;
  const { columns: exportColumns, onStart, onComplete } = typeof options.exportable === 'object' ? options.exportable : {};

  const exportProps = useExport({
    exporter: () => Promise.resolve(items),
    isDisabled: items.length === 0,
    columns: exportColumns,
    onStart,
    onComplete,
  });

  return exportEnabled ? exportProps : {};
};

export default useExportWithItems;
