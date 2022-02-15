import { stringToId, isNotEmpty } from './helpers';
import { getFilterConfigItem } from './filterConfigHelpers';
import filterTypeHelpers from './filterTypeHelpers';

const filterChipTemplates = (configItem, value) => filterTypeHelpers(configItem.type)?.filterChips(configItem, value);

export const toFilterChips = (filterConfig, activeFilters) =>
  Object.entries(activeFilters)
    .map(([filter, value]) => (isNotEmpty(value) ? filterChipTemplates(getFilterConfigItem(filterConfig, filter), value) : undefined))
    .filter((v) => !!v);

export const toDeselectValue = (filterConfig, chip, activeFilters) => {
  const configItem = getFilterConfigItem(filterConfig, stringToId(chip.category));
  return filterTypeHelpers(configItem.type).toDeselectValue(configItem, chip, activeFilters);
};
