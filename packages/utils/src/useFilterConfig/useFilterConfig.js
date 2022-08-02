import useSelectionManager from '../useSelectionManager';
import { toFilterConfig, toSelectValue } from './filterConfigHelpers';
import { toDeselectValue, toFilterChips } from './filterChipHelpers';

/**
 * Provides `PrimaryToolbar` props for the `ConditionalFilter` component filter configuration.
 *
 * @param {Object} [options]
 */
const useFilterConfig = (options = {}) => {
  const { filters, onDeleteFilter, resetOnClear, onFilterUpdate: onFilterUpdateCallback } = options;
  const enableFilters = !!filters;
  const { filterConfig = [], activeFilters: initialActiveFilters } = filters || {};
  const { selection: activeFilters, select, deselect, reset, clear } = useSelectionManager(initialActiveFilters, { withGroups: true });

  const onFilterUpdate = (filter, selectedValue, selectedValues) => {
    select(...toSelectValue(filterConfig, filter, selectedValue, selectedValues));
    onFilterUpdateCallback?.();
  };

  const onFilterDelete = async (_event, chips, clearAll = false) => {
    clearAll ? (resetOnClear ? reset() : clear()) : deselect(...toDeselectValue(filterConfig, chips[0], activeFilters));
    onDeleteFilter?.(chips, clearAll);
  };

  return enableFilters
    ? {
        toolbarProps: {
          filterConfig: toFilterConfig(filterConfig, activeFilters, onFilterUpdate),
          activeFiltersConfig: {
            filters: toFilterChips(filterConfig, activeFilters),
            onDelete: onFilterDelete,
          },
        },
        activeFilters,
      }
    : {};
};

export default useFilterConfig;
