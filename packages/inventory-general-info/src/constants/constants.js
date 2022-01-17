import PropTypes from 'prop-types';

export const prepareRows = (rows = [], pagination = {}) =>
  rows.slice((pagination.page - 1) * pagination.perPage, pagination.page * pagination.perPage);

export const isDate = (date) => {
  return !(isNaN(date) && isNaN(Date.parse(date)));
};

export const filterRows = (rows = [], activeFilters = {}) =>
  rows.filter(
    (row) =>
      Object.values(activeFilters).length === 0 ||
      Object.values(activeFilters).every((filter) => {
        const rowValue = row[filter.key] && (row[filter.key].sortValue || row[filter.key]);
        return (
          rowValue &&
          (Array.isArray(filter.value)
            ? filter.value.includes(rowValue)
            : rowValue.toLocaleLowerCase().indexOf(filter.value.toLocaleLowerCase()) !== -1)
        );
      })
  );

export const generateFilters = (cells = [], filters = [], activeFilters = {}, onChange = () => undefined) =>
  filters.map((filter, key) => {
    const activeKey = filter.index || key;
    const activeLabel = cells[activeKey] && (cells[activeKey].title || cells[activeKey]);

    return {
      value: String(activeKey),
      label: activeLabel,
      type: filter.type || 'text',
      filterValues: {
        id: filter.id || `${activeLabel}-${activeKey}`,
        onChange: (_e, newFilter) => onChange(activeKey, newFilter, activeLabel),
        value: activeFilters[activeKey] && activeFilters[activeKey].value,
        ...(filter.options && { items: filter.options }),
      },
    };
  });

export const onDeleteFilter = (deleted = {}, deleteAll = false, activeFilters = {}) => {
  if (deleteAll) {
    return {};
  } else {
    const { [deleted.key]: workingItem, ...filtersRest } = activeFilters;
    const newValue =
      workingItem && Array.isArray(workingItem.value) && workingItem.value.filter((item) => !deleted.chips.find(({ name }) => name === item));
    const newFilter =
      workingItem && Array.isArray(workingItem.value) && newValue && newValue.length > 0
        ? {
            [deleted.key]: {
              ...workingItem,
              value: newValue,
            },
          }
        : {};
    return {
      ...filtersRest,
      ...newFilter,
    };
  }
};

export const extraShape = PropTypes.shape({
  title: PropTypes.node,
  value: PropTypes.node,
  singular: PropTypes.node,
  plural: PropTypes.node,
  onClick: PropTypes.func,
});
