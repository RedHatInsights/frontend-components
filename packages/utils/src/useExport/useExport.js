import { callCallback, filename, linkAndDownload, csvForItems, jsonForItems, exportableColumns } from './helpers';

const useExport = ({ exporter, columns = [], isDisabled = false, onStart, onComplete, onError }) => {
  const exportColumns = exportableColumns(columns);
  const exportWithFormat = async (format) => {
    callCallback(onStart);
    const items = await exporter()
      .then((items) => {
        callCallback(onComplete, items);
        return items;
      })
      .catch((error) => callCallback(onError, error));

    const formater = format === 'csv' ? csvForItems : jsonForItems;

    if (items) {
      return linkAndDownload(
        formater({
          items,
          columns: exportColumns,
        }),
        filename(format)
      );
    } else {
      console.info('No items returned for export');
      return;
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

export default useExport;
