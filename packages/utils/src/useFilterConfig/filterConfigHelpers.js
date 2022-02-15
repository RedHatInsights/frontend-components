import { stringToId, defaultPlaceholder } from './helpers';
import filterTypeHelpers from './filterTypeHelpers';

const getActiveFilters = (configItem, activeFilters) =>
  filterTypeHelpers(configItem.type)?.getActiveFilterValues?.(configItem, activeFilters) || activeFilters[stringToId(configItem.label)];

const toFilterConfigItem = (configItem, handler, activeFilters) => {
  const value = getActiveFilters(configItem, activeFilters);
  const filterValues = filterTypeHelpers(configItem.type)?.filterValues(configItem, handler, value);
  return filterValues
    ? {
        type: configItem.type,
        label: configItem.label,
        className: configItem.className, // TODO questionable... maybe add a props prop
        placeholder: configItem?.placeholder ?? defaultPlaceholder(configItem.label),
        id: stringToId(configItem.label),
        filterValues,
      }
    : undefined;
};

export const toFilterConfig = (filterConfig, activeFilters, handler) => ({
  items: filterConfig.map((configItem) => toFilterConfigItem(configItem, handler, activeFilters)).filter((v) => !!v),
});

export const getFilterConfigItem = (filterConfig, filter) => filterConfig.find((configItem) => stringToId(configItem.label) === stringToId(filter));

export const toSelectValue = (filterConfig, filter, selectedValue, selectedValues) => {
  const configItem = getFilterConfigItem(filterConfig, filter);
  return filterTypeHelpers(configItem.type).toSelectValue(configItem, selectedValues, selectedValue);
};
