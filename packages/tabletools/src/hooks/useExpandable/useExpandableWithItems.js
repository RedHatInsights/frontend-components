import useExpandable from './useExpandable';
import { itemDetailsRow } from './helpers';

const useExpandableWithItems = (options) => {
  const enableExpanbale = !!options.detailsComponent;
  const expandable = useExpandable(options);

  const openItem = (row, item, _columns, rowIndex) => [
    {
      ...row,
      isOpen: expandable.openItems?.includes(item.itemId) || false,
    },
    itemDetailsRow(item, rowIndex, options),
  ];

  return enableExpanbale
    ? {
        ...expandable,
        transformer: openItem,
      }
    : {};
};

export default useExpandableWithItems;
