import { useEffect, useState } from 'react';
import { mergeArraysUniqly } from '../helpers/';
import { compileTitle, checkboxState, selectOrUnselect, checkCurrentPageSelected } from './helpers';

/**
 * Provides properties for a Pattternfly (based) Table and Toolbar component to implement bulk selection
 *
 * @param {number} total Number to show as total count
 * @param {Function} onSelect function to call when a selection is made
 * @param {Array} preselected Array of itemIds selected when initialising
 * @param {Function} itemIdsInTable async function that returns an array of all item ids
 * @param {Function} itemIdsOnPage async function that returns an array of item ids visible on the page
 * @param {string} [identifies] Prop of the row containing the item ID
 * @return {{ selectedIds: array, selectNone: Function }}
 */
const useBulkSelect = ({ total, onSelect, preselected, itemIdsInTable, itemIdsOnPage, identifier = 'id' }) => {
  const enableBulkSelect = !!onSelect;
  // TODO use SelectionManager here.
  const [selectedIds, setSelectedItemIds] = useState(preselected || []);
  const selectedIdsTotal = (selectedIds || []).length;
  const paginatedTotal = itemIdsOnPage().length;
  const allSelected = selectedIdsTotal === total;
  const noneSelected = selectedIdsTotal === 0;
  const currentPageSelected = checkCurrentPageSelected(itemIdsOnPage(), selectedIds || []);

  const isDisabled = total === 0;
  const checked = checkboxState(selectedIdsTotal, total);
  const title = compileTitle(selectedIdsTotal);

  const onSelectCallback = async (func) => {
    const newSelectedItemsIds = await func();
    setSelectedItemIds(newSelectedItemsIds);
    onSelect?.(newSelectedItemsIds);
  };

  const selectItems = (itemIds) => mergeArraysUniqly(selectedIds, itemIds);

  const unselectItems = (itemIds) => selectedIds.filter((itemId) => !itemIds.includes(itemId));

  const unselectAll = () => [];
  const selectNone = () => onSelectCallback(unselectAll);
  const selectOne = (_, selected, key, row) =>
    onSelectCallback(() => (selected ? selectItems([row?.[identifier]]) : unselectItems([row?.[identifier]])));

  const selectPage = () =>
    onSelectCallback(() => {
      const currentPageIds = itemIdsOnPage();
      const currentPageSelected = mergeArraysUniqly(selectedIds, currentPageIds).length === selectedIds.length;

      return currentPageSelected ? unselectItems(currentPageIds) : selectItems(currentPageIds);
    });

  const selectAll = () => onSelectCallback(async () => (allSelected ? unselectAll() : selectItems(await itemIdsInTable())));

  // TODO This useEffect to update the selected items should not be necessary
  useEffect(() => {
    setSelectedItemIds(preselected);
  }, [preselected]);

  return enableBulkSelect
    ? {
        selectedIds,
        selectNone,
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
                onClick: selectNone,
                props: {
                  isDisabled: noneSelected,
                },
              },
              {
                title: `${selectOrUnselect(currentPageSelected)} page (${paginatedTotal} items)`,
                onClick: selectPage,
              },
              {
                title: `${selectOrUnselect(allSelected)} all (${total} items)`,
                onClick: selectAll,
              },
            ],
            checked,
            onSelect: !isDisabled ? selectPage : undefined,
          },
        },
      }
    : {};
};

export default useBulkSelect;
