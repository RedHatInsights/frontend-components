import get from 'lodash/get';
import camelCase from 'lodash/camelCase';
const CSV_FILE_PREFIX = 'compliance-export';
const CSV_DELIMITER = ',';
const ENCODINGS = {
  csv: 'text/csv',
  json: 'application/json',
};

export const filename = (format) => CSV_FILE_PREFIX + '-' + new Date().toISOString() + '.' + format;

const encoding = (format) => `data:${ENCODINGS[format]};charset=utf-8`;

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

  return encodeURI(`${encoding('csv')},${csvRows.join('\n')}`);
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

  return encodeURI(`${encoding('json')},${JSON.stringify(result)}`);
};

export const exportableColumns = (columns) => columns.filter((column) => column.export !== false && (column.exportKey || column.renderExport));
