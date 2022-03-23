import withExport from './withExport';

export const withExportWithItems = (items, columns, options = {}) => {
  const exportEnabled = options?.exportable;
  const { columns: exportColumns, onStart, onComplete } = typeof options.exportable === 'object' ? options.exportable : {};

  const exportProps = withExport({
    exporter: () => Promise.resolve(items),
    isDisabled: items.length === 0,
    columns: exportColumns,
    onStart,
    onComplete,
  });

  return exportEnabled ? exportProps : {};
};

export default withExportWithItems;
