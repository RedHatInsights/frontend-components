import merge from 'lodash/merge';
import mapKeys from 'lodash/mapKeys';

export const CSV_TYPE = 'text/csv;charset=utf-8;';
export const JSON_TYPE = 'data:text/json;charset=utf-8,';
const monthMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export function mergeArraysByKey(arrays, key = 'id') {
  let mergedObject = merge(...arrays.map((row) => mapKeys(row, (a) => a && a[key])));
  return Object.values(mergedObject);
}

export function downloadFile(data, filename = `${new Date().toISOString()}`, format = CSV_TYPE) {
  const type = format === 'json' ? JSON_TYPE : CSV_TYPE;
  const blob = new Blob([data], { type });
  const link = document.createElement('a');
  link.setAttribute('href', URL.createObjectURL(blob));
  link.setAttribute('download', `${filename}.${format}`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function processDate(dateString) {
  const date = new Date(dateString);
  const month = monthMap[date.getMonth()];
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  if (!month || isNaN(day)) {
    return 'N/A';
  }

  return `${day} ${month} ${date.getFullYear()}`;
}

export function getBaseName(pathname, level = 2) {
  let release = '/';
  const pathName = pathname.replace(/(#|\?).*/, '').split('/');

  pathName.shift();

  if (pathName[0] === 'beta') {
    pathName.shift();
    release = `/beta/`;
  }

  return [...new Array(level)].reduce((acc, _curr, key) => {
    return `${acc}${pathName[key] || ''}${key < level - 1 ? '/' : ''}`;
  }, release);
}

export const generateFilter = (data, path = 'filter', options) =>
  Object.entries(data || {}).reduce((acc, [key, value]) => {
    const newPath = `${path || ''}[${key}]${Array.isArray(value) ? `${options?.arrayEnhancer ? `[${options.arrayEnhancer}]` : ''}[]` : ''}`;
    if (value instanceof Function || value instanceof Date) {
      return acc;
    }

    return {
      ...acc,
      ...(Array.isArray(value) || typeof value !== 'object' ? { [newPath]: value } : generateFilter(value, newPath, options)),
    };
  }, {});

export const toUpperCase = (text = '') => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
