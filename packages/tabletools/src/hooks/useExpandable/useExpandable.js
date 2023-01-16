import useSelectionManager from '../useSelectionManager';

/**
 * Provides props for a Patternfly table to manage expandable items/rows.
 *
 */
const useExpandable = () => {
  const { selection: openItems, toggle } = useSelectionManager([]);

  const onCollapse = (_event, _index, _isOpen, { itemId }) => toggle(itemId);

  return {
    openItems,
    tableProps: {
      onCollapse,
    },
  };
};

export default useExpandable;
