import isArray from 'lodash/isEmpty';
import isObject from 'lodash/isObject';

export const stringToId = (string) => string.split(/\s+/).join('-').toLowerCase();

export const findWithString = (value) => (item) => String(item.value) === String(value);

export const defaultPlaceholder = (label) => `Filter by ${label.toLowerCase()}`;

export const defaultOnChange = (handler, label) => ({
  onChange: (_event, selectedValues, selectedValue) => {
    handler(label, selectedValue, selectedValues);
  },
});

export const flattenConfigItems = (configItem) =>
  configItem.items.flatMap((parentItem) => [parentItem, ...parentItem.items.map((item) => ({ ...item, parent: parentItem }))]);

export const configItemItemByLabel = (configItem, label) => configItem.items.find(({ label: itemLabel }) => itemLabel === label);

export const itemForValueInGroups = (configItem, value) => {
  const flatItems = flattenConfigItems(configItem);
  const item = flatItems.find(({ value: itemValue }) => {
    return `${itemValue}` === `${value}`;
  });
  return item;
};

export const itemForLabelInGroups = (configItem, label) => {
  const flatItems = flattenConfigItems(configItem);
  const item = flatItems.find(({ label: ItemLabel }) => {
    return `${ItemLabel}` === `${label}`;
  });
  return item;
};

export const isNotEmpty = (value) => (isArray(value) && value?.length > 0) || value !== '' || (isObject(value) && Object.keys(value).length > 0);
