import React, { createContext } from 'react';
import { Badge, Tooltip } from '@patternfly/react-core';
import { loadEntities } from '../redux/actions';
export const TEXT_FILTER = 'hostname_or_id';
export const TEXTUAL_CHIP = 'textual';
export const TAG_CHIP = 'tags';
export const STALE_CHIP = 'staleness';
export const REGISTERED_CHIP = 'registered_with';
export const staleness = [
    { label: 'Fresh', value: 'fresh' },
    { label: 'Stale', value: 'stale' },
    { label: 'Stale warning', value: 'stale_warning' }
];
export const registered = [{ label: 'Insights', value: 'insights' }];
export const InventoryContext = createContext({});
export const defaultFilters = {
    staleFilter: [ 'fresh', 'stale' ],
    registeredWithFilter: [ 'insights' ]
};

export function constructValues(groupValue) {
    return Object.entries(groupValue).map(([ key, { isSelected, group, item }]) => {
        if (isSelected) {
            const { tag: { key: tagKey, value: tagValue } } = item.meta;
            return {
                key,
                tagKey,
                value: tagValue,
                name: `${tagKey}=${tagValue}`,
                group
            };
        }
    }).filter(Boolean);
}

export function mapGroups(currSelection, valuesKey = 'values') {
    return Object.entries(currSelection).map(([ groupKey, groupValue ]) => {
        const values = constructValues(groupValue, groupKey);
        if (values && values.length > 0) {
            return {
                type: 'tags',
                key: groupKey,
                category: values[0].group.label,
                [valuesKey]: values
            };
        }
    }).filter(Boolean);
}

export function filterToGroup(filter = [], valuesKey = 'values') {
    return filter.reduce((accGroup, group) => ({
        ...accGroup,
        [group.key]: group[valuesKey].reduce((acc, curr) => ({ ...acc, [curr.key]: {
            isSelected: true,
            group: curr.group,
            item: {
                meta: {
                    tag: {
                        key: curr.key,
                        value: curr.value
                    }
                }
            }
        } }), {})
    }), {});
}

export function constructGroups(allTags) {
    return allTags.map(({ name, tags }) => ({
        label: name,
        value: name,
        type: 'checkbox',
        items: tags.map(({ count, tag: { key: tagKey, value } }) => ({
            label: <React.Fragment>
                <div className="ins-c-inventory__tags-filter--tag-name">{tagKey}={value}</div>
                <Tooltip
                    position="right"
                    enableFlip
                    content={`Applicable to ${count} system${count === 1 ? '' : 's'}.`}
                >
                    <Badge isRead={count <= 0}>{ count }</Badge>
                </Tooltip>
            </React.Fragment>,
            meta: {
                count,
                tag: {
                    key: tagKey,
                    value
                }
            },
            value: tagKey
        }))
    }));
}

export const arrayToSelection = (selected) => selected.reduce((acc, { cells: [ key, value, namespace ] }) => ({
    ...acc,
    [namespace]: {
        ...acc[namespace?.title || namespace],
        [key?.title || key]: {
            isSelected: true,
            group: { value: namespace?.title || namespace, label: namespace?.title || namespace },
            item: {
                value: key?.title || key,
                meta: { tag: { key: key?.title || key, value: value?.title || value } }
            }
        }
    }
}), {});

export function reduceFilters(filters) {
    return filters.reduce((acc, oneFilter) => {
        if (oneFilter.value === TEXT_FILTER) {
            return { ...acc, textFilter: oneFilter.filter };
        } else if ('tagFilters' in oneFilter) {
            return {
                ...acc,
                tagFilters: filterToGroup(oneFilter.tagFilters)
            };
        } else if ('staleFilter' in oneFilter) {
            return {
                ...acc,
                staleFilter: oneFilter.staleFilter
            };
        } else if ('registeredWithFilter' in oneFilter) {
            return {
                ...acc,
                registeredWithFilter: oneFilter.registeredWithFilter
            };
        }

        return acc;
    }, {
        textFilter: '',
        tagFilters: {},
        ...defaultFilters
    });
}

export const loadSystems = (options, showTags) => {
    // eslint-disable-next-line camelcase
    const currPerPage = options?.perPage || options?.per_page;

    const limitedItems = options?.items?.length > currPerPage ? options?.items?.slice(
        (options?.page - 1) * currPerPage, options?.page * currPerPage
    ) : options?.items;
    const config = {
        ...options.hasItems && {
            sortBy: options?.sortBy?.key,
            orderDirection: options?.sortBy?.direction?.toUpperCase()
        },
        // eslint-disable-next-line camelcase
        per_page: currPerPage,
        filters: options.activeFilters,
        ...options,
        ...limitedItems?.length > 0 && {
            itemsPage: options?.page,
            page: 1
        }
    };

    return loadEntities(limitedItems, config, { showTags });
};

export const reloadWrapper = (event, callback) => {
    event.payload.then(data => {
        callback();
        return data;
    });

    return event;
};
