import React from 'react';
import { Badge, Tooltip } from '@patternfly/react-core';

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

export function constructGroups(allTags, item = 'item') {
    return allTags.map(({ name, tags, type = 'checkbox' }) => ({
        label: name,
        value: name,
        type,
        items: tags.map(({ count, tag: { key: tagKey, value } }) => ({
            className: 'ins-c-tagfilter__option',
            label: <React.Fragment>
                <div className="ins-c-tagfilter__option-value">{tagKey}={value}</div>
                <Tooltip
                    position="right"
                    enableFlip
                    content={`Applicable to ${count} ${item}${count === 1 ? '' : 's'}.`}
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
