import useSelectionManager from '../useSelectionManager';

const useExpandable = (options) => {
  const enableExpanbale = !!options.detailsComponent;
  const { selection: openItems, toggle } = useSelectionManager([]);

  const onCollapse = (_event, _index, _isOpen, { itemId }) => toggle(itemId);

  return enableExpanbale
    ? {
        openItems,
        tableProps: {
          onCollapse,
        },
      }
    : {};
};

export default useExpandable;
