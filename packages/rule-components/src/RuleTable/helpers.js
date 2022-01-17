import get from 'lodash/get';

export const calculateMeta = (meta) => ({
  itemCount: meta.count,
  perPage: meta.limit || 10,
  page: (meta.offset || 0) / (meta.limit || 10) + 1,
  ...meta,
});

export const calculateActiveFilters = (activeFilter, value, key) =>
  value &&
  value.length > 0 &&
  activeFilter && {
    category: activeFilter.label,
    type: activeFilter.filterKey,
    chips:
      activeFilter.filterValues.items && activeFilter.filterValues.items.length > 0
        ? (Array.isArray(value) ? value : [value]).map((oneValue) => {
            const currFilter = activeFilter.filterValues.items.find(({ value: currValue }) => `${currValue}` === oneValue);
            return {
              name: (currFilter || { textual: oneValue }).textual,
              value: oneValue,
              key,
            };
          })
        : [{ name: value, key }],
  };

export const createRows = (data, columns, expanded, detail) =>
  data.map((oneRule, ruleKey) => [
    {
      cells: columns.map(({ selector }, cellKey) => ({
        title: typeof selector === 'function' ? selector(oneRule, ruleKey, cellKey) : get(oneRule, selector, 'Not found'),
      })),
      isOpen: !!oneRule.isOpen || expanded.includes(oneRule.rule_id) || expanded.includes(ruleKey),
      ruleId: oneRule.rule_id,
    },
    detail && {
      parent: ruleKey * 2,
      fullWidth: true,
      noPadding: true,
      cells: [
        {
          title: typeof detail === 'function' ? detail(oneRule, ruleKey) : detail,
        },
      ],
    },
  ]);
