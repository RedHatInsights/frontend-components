
export const filterSelected = (items, selectedIds = []) => items.filter((item) => selectedIds.includes(item.itemId));
