import React from 'react';
import { Badge, Tooltip, TooltipPosition } from '@patternfly/react-core';

export const TEXT_FILTER = 'hostname_or_id';
export const TEXTUAL_CHIP = 'textual';
export const TAG_CHIP = 'tags';

export function constructValues(groupValue, tags) {
    return Object.entries(groupValue).map(([ key, value ]) => {
        if (value) {
            const { tag: { key: tagKey, value: tagValue } } = tags[key];
            return {
                key,
                tagKey,
                value: tagValue,
                name: `${tagKey}: ${tagValue}`
            };
        }
    }).filter(Boolean);
}

export function mapGroups(currSelection, allTags, valuesKey = 'values') {
    return Object.entries(currSelection).map(([ groupKey, groupValue ]) => {
        const { tags, name } = allTags[groupKey];
        const values = constructValues(groupValue, tags);
        if (values && values.length > 0) {
            return {
                type: 'tags',
                key: groupKey,
                category: name,
                [valuesKey]: values
            };
        }
    }).filter(Boolean);
}

export function filterToGroup(filter = [], valuesKey = 'values') {
    return filter.reduce((accGroup, group) => ({
        ...accGroup,
        [group.key]: group[valuesKey].reduce((acc, curr) => ({ ...acc, [curr.key]: true }), {})
    }), {});
}

export function constructGroups(allTags) {
    return allTags.map(({ name, tags }, key) => ({
        label: name,
        value: key,
        type: 'checkbox',
        items: tags.map(({ count,  tag: { key: tagKey, value } }) => ({
            label: <React.Fragment>
                <div>{tagKey}: {value}</div>
                <Tooltip
                    position="right"
                    enableFlip
                    content={`Applicable to ${count} systems.`}
                >
                    <Badge isRead={count <= 0}>{ count }</Badge>
                </Tooltip>
            </React.Fragment>
        }))
    }));
}

export function reduceFilters(filters) {
    return filters.reduce((acc, oneFilter) => {
        if (oneFilter.value === TEXT_FILTER) {
            return { ...acc, textFilter: oneFilter.filter };
        } else if ('tagFilters' in oneFilter) {
            return {
                ...acc,
                tagFilters: filterToGroup(oneFilter.tagFilters)
            };
        }
    }, {
        textFilter: '',
        tagFilters: {}
    });
}
