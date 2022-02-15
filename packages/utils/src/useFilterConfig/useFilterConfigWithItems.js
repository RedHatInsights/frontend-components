import useFilterConfig from './useFilterConfig';
import { getFilterConfigItem } from './filterConfigHelpers';

const useFilterConfigWithItems = (options = {}) => {
  const { filterConfig = [] } = options.filters || {};
  const filterConfigBase = useFilterConfig(options);

  const filter = (filterConfig, activeFilters) => (objects) => {
    let filteredObjects = [...objects];
    // TODO this should be nicer.
    Object.entries(activeFilters).forEach(([filter, value]) => {
      const configItem = getFilterConfigItem(filterConfig, filter);
      const valueToPass = configItem.type === 'text' ? value[0] : value;

      if (!configItem || !value) {
        return;
      }

      if (valueToPass?.length > 0 || (configItem.type === 'hidden' && typeof value === 'boolean')) {
        filteredObjects = configItem.filter(filteredObjects, valueToPass);
      }
    });

    return filteredObjects;
  };

  return {
    ...filterConfigBase,
    filter: filter(filterConfig, filterConfigBase.activeFilters || {}),
  };
};

export default useFilterConfigWithItems;
