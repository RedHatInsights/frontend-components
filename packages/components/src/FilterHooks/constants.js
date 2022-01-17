import React from 'react';
import { Badge, Tooltip } from '@patternfly/react-core';

export function mapGroups(currSelection, valuesKey = 'values') {
  return Object.entries(currSelection || {}).reduce((acc, [groupKey, groupValue]) => {
    const values = constructValues(groupValue, groupKey);
    if (values.length > 0) {
      return [
        ...acc,
        {
          type: 'tags',
          key: groupKey,
          category: values[0]?.group?.value || values[0]?.group?.label,
          [valuesKey]: values,
        },
      ];
    }

    return acc;
  }, []);
}

export function constructValues(groupValue, groupKey) {
  return Object.entries(groupValue || {}).reduce((acc, [key, { isSelected, group, value, item }]) => {
    if (isSelected) {
      const { key: tagKey, value: tagValue } = item?.meta?.tag || {
        key: item?.tagKey || groupKey,
        value: value || item?.tagValue,
      };
      return [
        ...acc,
        {
          key,
          tagKey,
          value: tagValue,
          name: `${tagKey}${tagValue ? `=${tagValue}` : ''}`,
          group: { value: groupKey, ...group },
        },
      ];
    }

    return acc;
  }, []);
}

export function constructGroups(allTags, item = 'item') {
  return allTags.map(({ name, tags, type = 'checkbox', ...rest }) => ({
    ...rest,
    label: name,
    value: name,
    type,
    items: tags.map(({ count, tag: { key: tagKey, value } }) => {
      const tagText = `${tagKey}${value ? `=${value}` : ''}`;
      return {
        className: 'ins-c-tagfilter__option',
        label: (
          <React.Fragment>
            <Tooltip content={tagText}>
              <div className="ins-c-tagfilter__option-value">{tagText}</div>
            </Tooltip>
            {count !== undefined && (
              <Tooltip position="right" enableFlip content={`Applicable to ${count} ${item}${count === 1 ? '' : 's'}.`}>
                <Badge isRead={count <= 0}>{count}</Badge>
              </Tooltip>
            )}
          </React.Fragment>
        ),
        meta: {
          count,
          tag: {
            key: tagKey,
            value,
          },
        },
        id: `${tagKey}-${value}`,
        tagKey,
        value: tagText,
        tagValue: value,
      };
    }),
  }));
}
