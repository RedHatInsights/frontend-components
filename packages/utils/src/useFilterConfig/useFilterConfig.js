import useSelectionManager from '../useSelectionManager';
import { toFilterConfig, toSelectValue } from './filterConfigHelpers';
import { toFilterChips, toDeselectValue } from './filterChipHelpers';

const useFilterConfig = (options = {}) => {
  const { filters, onDeleteFilter, resetOnClear } = options;
  const enableFilters = !!filters;
  const { filterConfig = [], activeFilters: initialActiveFilters } = filters || {};
  const { selection: activeFilters, select, deselect, reset, clear } = useSelectionManager(initialActiveFilters, { withGroups: true });

  const onFilterUpdate = (filter, selectedValue, selectedValues) => select(...toSelectValue(filterConfig, filter, selectedValue, selectedValues));

  const onFilterDelete = async (_event, chips, clearAll = false) => {
    clearAll ? (resetOnClear ? reset() : clear()) : deselect(...toDeselectValue(filterConfig, chips[0], activeFilters));
    onDeleteFilter && onDeleteFilter(chips, clearAll);
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
