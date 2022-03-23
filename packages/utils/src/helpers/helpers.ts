import merge from 'lodash/merge';
import mapKeys from 'lodash/mapKeys';

export const CSV_TYPE = 'text/csv;charset=utf-8;';
export const JSON_TYPE = 'data:text/json;charset=utf-8,';
const monthMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export function mergeArraysByKey(arrays: Record<string, unknown>[][], key = 'id') {
  // @ts-ignore
  const mergedObject = merge(...arrays.map((row) => mapKeys(row, (a) => a && a[key])));
  return Object.values(mergedObject);
}

export function downloadFile(data: unknown, filename = `${new Date().toISOString()}`, format = CSV_TYPE) {
  const type = format === 'json' ? JSON_TYPE : CSV_TYPE;
  const blob = new Blob([data as unknown as BlobPart], { type });
  const link = document.createElement('a');
  link.setAttribute('href', URL.createObjectURL(blob));
  link.setAttribute('download', `${filename}.${format}`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function processDate(dateString: string | number | Date) {
  const date = new Date(dateString);
  const month = monthMap[date.getMonth()];
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  if (!month || isNaN(day as number)) {
    return 'N/A';
  }

  return `${day} ${month} ${date.getFullYear()}`;
}

export function getBaseName(pathname: string, level = 2) {
  const previewFragment = pathname.split('/')[1];
  const isPreview = ['beta', 'preview'].includes(previewFragment);
  let release = '/';
  const pathName = pathname.replace(/(#|\?).*/, '').split('/');

  pathName.shift();

  if (isPreview) {
    pathName.shift();
    release = `/${previewFragment}/`;
  }

  return [...new Array(level)].reduce<string>((acc, _curr, key) => {
    return `${acc}${pathName[key] || ''}${key < level - 1 ? '/' : ''}`;
  }, release);
}

export type FilterData<T = Record<string, unknown | string | Date | ((...args: unknown[]) => unknown)>> =
  | object
  | null
  | Record<string, unknown | string | Date | ((...args: unknown[]) => unknown) | T>;

export const generateFilter = (data: FilterData, path = 'filter', options?: { arrayEnhancer: string }): Record<string, string> =>
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

const getIdProp = (item, idProp = 'id') => item[idProp];

const identify = (item, identifier) => {
  if (typeof identifier === 'string') {
    return {
      ...item,
      itemId: getIdProp(item, identifier),
    };
  } else {
    return {
      ...item,
      itemId: identifier(item),
    };
  }
};

export const identifyItems = (items, options = {}) => {
  const identifier = options?.identifier || getIdProp;

  return items.map((item) => identify(item, identifier));
};
