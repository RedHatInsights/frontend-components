import { useEffect } from 'react';
import useSelectionManager from '../useSelectionManager';
import { compileTitle, checkboxState, selectOrUnselect, checkCurrentPageSelected } from './helpers';

/**
 * Provides properties for a Pattternfly (based) Table and Toolbar component to implement bulk selection
 *
 * @param {number} [total] Number to show as total count
 * @param {Function} [onSelect] function to call when a selection is made
 * @param {Array} [preselected] Array of itemIds selected when initialising
 * @param {Function} [itemIdsInTable] async function that returns an array of all item ids
 * @param {Function} [itemIdsOnPage] async function that returns an array of item ids visible on the page
 * @param {string} [identifies] Prop of the row containing the item ID
 * @returns {{ selectedIds , selectNone, tableProps }}
 */
const useBulkSelect = ({ total = 0, onSelect, preselected, itemIdsInTable, itemIdsOnPage, identifier = 'id' }) => {
  const enableBulkSelect = !!onSelect;
  const { selection: selectedIds, set, select, deselect, clear } = useSelectionManager(preselected);
  const selectedIdsTotal = (selectedIds || []).length;
  const idsOnPage = itemIdsOnPage();
  const paginatedTotal = idsOnPage.length || total;
  const allSelected = selectedIdsTotal === total;
  const noneSelected = selectedIdsTotal === 0;
  const currentPageSelected = checkCurrentPageSelected(idsOnPage, selectedIds);

  const isDisabled = total === 0;
  const checked = checkboxState(selectedIdsTotal, total);
  const title = compileTitle(selectedIdsTotal);

  const selectOne = (_, selected, _key, row) => (selected ? select(row[identifier]) : deselect(row[identifier]));
  const selectPage = () => (currentPageSelected ? select(idsOnPage) : deselect(idsOnPage));
  const selectAll = async () => {
    const items = await itemIdsInTable();
    if (allSelected) {
      clear();
    } else {
      set(items);
    }
  };

  useEffect(() => {
    set(preselected);
  }, [JSON.stringify(preselected)]);

  return enableBulkSelect
    ? {
        selectedIds,
        selectNone: () => clear(),
        tableProps: {
          onSelect: total > 0 ? selectOne : undefined,
          canSelectAll: false,
        },
        toolbarProps: {
          bulkSelect: {
            toggleProps: { children: [title] },
            isDisabled,
            items: [
              {
                title: 'Select none',
                onClick: () => clear(),
                props: {
                  isDisabled: noneSelected,
                },
              },
              ...(itemIdsOnPage
                ? [
                    {
                      title: `${selectOrUnselect(currentPageSelected)} page (${paginatedTotal} items)`,
                      onClick: selectPage,
                    },
                  ]
                : []),
              ...(itemIdsInTable
                ? [
                    {
                      title: `${selectOrUnselect(allSelected)} all (${total} items)`,
                      onClick: selectAll,
                    },
                  ]
                : []),
            ],
            checked,
            onSelect: !isDisabled ? selectPage : undefined,
          },
        },
      }
    : {};
};

export default useBulkSelect;
