import get from 'lodash/get';
import camelCase from 'lodash/camelCase';
import { downloadFile } from '../helpers';

const CSV_FILE_PREFIX = 'CRC';
const CSV_DELIMITER = ',';

const textForCell = (row, column) => {
  const { exportKey, renderExport } = column;
  let cell = exportKey ? get(row, exportKey) : row;
  if (renderExport) {
    return renderExport(cell);
  } else {
    return cell;
  }
};

export const csvForItems = ({ items, columns }) => {
  const header = columns.map((column) => column.original || column.title).join(CSV_DELIMITER);
  const csvRows = [header, ...items.map((row) => columns.map((column) => `"${textForCell(row, column)}"`).join(CSV_DELIMITER))];

  return csvRows.join('\n');
};

export const jsonForItems = ({ items, columns }) => {
  const result = items.map((row) =>
    columns.reduce((object, column) => {
      const key = camelCase(column.original || column.title);
      const value = textForCell(row, column);

      object[key] = value;
      return object;
    }, {})
  );

  return JSON.stringify(result);
};

export const exportableColumns = (columns) => columns.filter((column) => column.export !== false && (column.exportKey || column.renderExport));

export const downloadItems = (columns, items, format) => {
  const formater = format === 'csv' ? csvForItems : jsonForItems;

  if (items) {
    downloadFile(
      formater({
        items,
        columns,
      }),
      CSV_FILE_PREFIX + '-' + new Date().toISOString(),
      format
    );
  } else {
    console.info('No items returned for export');
  }
};
