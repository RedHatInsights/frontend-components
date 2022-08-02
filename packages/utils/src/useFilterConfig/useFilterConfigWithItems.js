import useFilterConfig from './useFilterConfig';
import { getFilterConfigItem } from './filterConfigHelpers';

/**
 * Provides `PrimaryToolbar` props for the `ConditionalFilter` component filter configuration and returns a `filter` function to filter items.
 *
 * @param {Object} [options]
 */
const useFilterConfigWithItems = (options = {}) => {
  const { filterConfig = [] } = options.filters || {};
  const filterConfigBase = useFilterConfig(options);

  const filter = (filterConfig, activeFilters) => (objects) =>
    Object.entries(activeFilters).reduce((filteredObjects, [filter, value]) => {
      const configItem = getFilterConfigItem(filterConfig, filter);
      const valueToPass = configItem.type === 'text' ? value[0] : value;
      const isHiddenBool = configItem?.type === 'hidden' && typeof valueToPass === 'boolean';

      if (valueToPass?.length > 0 || isHiddenBool) {
        return configItem.filter(filteredObjects, valueToPass);
      } else {
        return filteredObjects;
      }
    }, objects);

  return options?.filters
    ? {
        ...filterConfigBase,
        filter: filter(filterConfig, filterConfigBase.activeFilters || {}),
      }
    : {};
};

export default useFilterConfigWithItems;
