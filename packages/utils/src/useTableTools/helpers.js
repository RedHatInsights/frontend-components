import React from 'react';
import { uniq } from '../helpers/';

export const filterSelected = (items, selectedIds = []) => items.filter((item) => selectedIds.includes(item.itemId));

export const filteredAndSortedItems = (items, filter, sorter) => {
  const filtered = filter?.(items) ?? items;
  return sorter?.(filtered) ?? filtered;
};

const mergeIfArray = (firstValue, secondValue) => {
  if (Array.isArray(firstValue)) {
    return uniq([...firstValue, ...(secondValue || [])]);
  } else {
    return secondValue;
  }
};

export const mergeFilters = (currentFilters, additionalFilters) =>
  Object.entries(currentFilters).reduce((acc, [filter, filterValue]) => {
    acc[filter] = mergeIfArray(filterValue, additionalFilters[filter]);
    return acc;
  }, {});

const prependEmptyFirstAction = (actions) => [undefined, ...actions];

export const toToolbarActions = ({ actions: actionsOption = [] }) => {
  const actions = prependEmptyFirstAction(actionsOption);

  return {
    toolbarProps: {
      actionsConfig: {
        actions,
      },
    },
  };
};

export const withDedidicatedAction = (options) => {
  const enableDedicatedAction = !!options.dedicatedAction;
  const { dedicatedAction: DedicatedActionOption, AdditionalDedicatedActions, selected } = options;

  return enableDedicatedAction
    ? {
        toolbarProps: {
          dedicatedAction: (
            <div>
              {DedicatedActionOption && <DedicatedActionOption {...(selected && { selected })} />}
              {AdditionalDedicatedActions && <AdditionalDedicatedActions {...(selected && { selected })} />}
            </div>
          ),
        },
      }
    : {};
};
