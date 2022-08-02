import { useEffect, useMemo } from 'react';
import { filterSelected } from '../useTableTools/helpers';
import { itemIds, selectItemTransformer } from './helpers';
import useBulkSelect from './useBulkSelect';

/**
 * Provides properties for a Pattternfly (based) Table and Toolbar component to implement bulk selection
 *
 * @param {Function} [onSelect] function to call when a selection is made
 * @param {Array} [items] Array of items selected when initialising
 *
 */
const useBulkSelectWithItems = ({ onSelect, items: propItems, filter, paginator, preselected, setPage }) => {
  const enableBulkSelect = !!onSelect;
  const items = propItems.map((item) => selectItemTransformer(item, preselected));
  const total = items.length;

  const filteredItems = filter?.(items) ?? items;
  const filteredTotal = filteredItems.length;
  const filtered = filteredTotal !== total;

  const paginatedItems = paginator?.(filteredItems) ?? filteredItems;
  const paginatedTotal = paginatedItems.length;

  const allCount = filteredTotal ?? total;

  const setPageMemo = useMemo(() => setPage, []);

  useEffect(() => {
    if (paginatedTotal === 0) {
      setPageMemo(-1);
    }
  }, [paginatedTotal, setPageMemo]);

  const { selectNone, selectedIds, ...bulkSelect } = useBulkSelect({
    total: allCount,
    onSelect,
    preselected,
    itemIdsInTable: async () => (filtered ? itemIds(filteredItems) : itemIds(items)),
    itemIdsOnPage: paginatedItems.map(({ itemId }) => itemId),
    identifier: 'itemId',
  });

  return enableBulkSelect
    ? {
        transformer: (item) => selectItemTransformer(item, selectedIds),
        selectedItems: filterSelected(items, selectedIds),
        selected: selectedIds,
        clearSelection: selectNone,
        ...bulkSelect,
      }
    : {};
};

export default useBulkSelectWithItems;
