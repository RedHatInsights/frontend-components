import get from 'lodash/get';

export const filterColumnsBySelected = (columns = [], selected = false, selectProp = '') =>
  columns.filter((column) => selected.includes(get(column, selectProp)));

const managableColumns = (columns = []) =>
  columns.map((column) => (column.managable === undefined ? { ...column, managable: true } : column)).filter((column) => column.managable === true);

export const filterManageableColumns = (columns = [], prop = '') => managableColumns(columns.filter((column) => column[prop] !== undefined));
