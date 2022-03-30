import { exportableColumns, downloadItems } from './helpers';

/**
 * Provides an `exportConfig` prop for a (Primary)Toolbar action
 *
 * @param {Function} exporter Function to return an array of items to be exported
 * @param {Array} columns columns for the export
 * @param {Boolean} [isDisabled] Wether or not export is enabled
 * @param {Function} [onStart] Function to call before the export
 * @param {Function} [onComplete] Function to call when the export succeeded
 * @param {Function} [onError] Function to call when there was an error exporting
 *
 */
const withExport = ({ exporter, columns = [], isDisabled = false, onStart, onComplete, onError }) => {
  const exportColumns = exportableColumns(columns);
  const exportWithFormat = async (format) => {
    onStart?.();
    try {
      const items = await exporter();
      downloadItems(exportColumns, items, format);
      onComplete?.(items);
    } catch (error) {
      onError?.(error);
    }
  };

  return {
    toolbarProps: {
      exportConfig: {
        isDisabled,
        onSelect: (_, format) => exportWithFormat(format),
      },
    },
  };
};

export default withExport;
