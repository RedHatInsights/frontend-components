import { createContext } from 'react';
import { loadEntities } from '../redux/actions';
export const TEXT_FILTER = 'hostname_or_id';
export const TEXTUAL_CHIP = 'textual';
export const TAG_CHIP = 'tags';
export const STALE_CHIP = 'staleness';
export const REGISTERED_CHIP = 'registered_with';
export const staleness = [
  { label: 'Fresh', value: 'fresh' },
  { label: 'Stale', value: 'stale' },
  { label: 'Stale warning', value: 'stale_warning' },
];
export const registered = [{ label: 'Insights', value: 'insights' }];
export const InventoryContext = createContext({});
export const defaultFilters = {
  staleFilter: ['fresh', 'stale'],
  registeredWithFilter: ['insights'],
};

export function filterToGroup(filter = [], valuesKey = 'values') {
  return filter.reduce(
    (accGroup, group) => ({
      ...accGroup,
      [group.key]: group[valuesKey].reduce(
        (acc, curr) => ({
          ...acc,
          [curr.key]: {
            isSelected: true,
            group: curr.group,
            item: {
              meta: {
                tag: {
                  key: curr.tagKey,
                  value: curr.value,
                },
              },
            },
          },
        }),
        {}
      ),
    }),
    {}
  );
}

export const arrayToSelection = (selected) =>
  selected.reduce(
    (acc, { cells: [key, value, namespace] }) => ({
      ...acc,
      [namespace]: {
        ...acc[namespace?.title || namespace],
        [key?.title || key]: {
          isSelected: true,
          group: { value: namespace?.title || namespace, label: namespace?.title || namespace },
          item: {
            value: key?.title || key,
            meta: { tag: { key: key?.title || key, value: value?.title || value } },
          },
        },
      },
    }),
    {}
  );

export function reduceFilters(filters = []) {
  return filters.reduce(
    (acc, oneFilter) => {
      if (oneFilter.value === TEXT_FILTER) {
        return { ...acc, textFilter: oneFilter.filter };
      } else if ('tagFilters' in oneFilter) {
        return {
          ...acc,
          tagFilters: filterToGroup(oneFilter.tagFilters),
        };
      } else if ('staleFilter' in oneFilter) {
        return {
          ...acc,
          staleFilter: oneFilter.staleFilter,
        };
      } else if ('registeredWithFilter' in oneFilter) {
        return {
          ...acc,
          registeredWithFilter: oneFilter.registeredWithFilter,
        };
      }

      return acc;
    },
    {
      textFilter: '',
      tagFilters: {},
      ...defaultFilters,
    }
  );
}

export const loadSystems = (options, showTags, getEntities) => {
  const limitedItems =
    options?.items?.length > options.per_page
      ? options?.items?.slice((options?.page - 1) * options.per_page, options?.page * options.per_page)
      : options?.items;

  const config = {
    ...(options.hasItems && {
      sortBy: options?.sortBy?.key,
      orderDirection: options?.sortBy?.direction?.toUpperCase(),
    }),
    ...options,
    filters: options?.filters || options?.activeFilters,
    orderBy: options?.orderBy || options?.sortBy?.key,
    orderDirection: options?.orderDirection?.toUpperCase() || options?.sortBy?.direction?.toUpperCase(),
    ...(limitedItems?.length > 0 && {
      itemsPage: options?.page,
      page: 1,
    }),
  };

  return loadEntities(limitedItems, config, { showTags }, getEntities);
};

export const reloadWrapper = (event, callback) => {
  event.payload.then((data) => {
    callback();
    return data;
  });

  return event;
};
