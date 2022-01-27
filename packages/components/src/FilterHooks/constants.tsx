import React from 'react';
import { Badge, Tooltip } from '@patternfly/react-core';

export type Tag = {
  key: string;
  value: string;
};

type TagGroup = {
  count: number;
  tag: Tag;
};

export type GroupItem = {
  tagKey: string;
  tagValue: string;
  meta?: {
    tag: Tag;
  };
};

type Group = {
  isSelected: boolean;
  group: Record<string, unknown>;
  value?: string;
  item?: GroupItem;
};

export type GroupValue = {
  [key: string]: Group;
};

type ConstructValuesItem = {
  key: string;
  tagKey: string;
  value?: string;
  name: string;
  group: Record<string, unknown>;
};

export type AllTag = {
  name: React.ReactNode;
  type?: 'checkbox';
  tags: TagGroup[];
};

export function constructValues(groupValue: GroupValue, groupKey: string) {
  return Object.entries(groupValue || {}).reduce<ConstructValuesItem[]>((acc, curr) => {
    const [key, { isSelected, group, value, item }] = curr;
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

interface MapGroupsItem {
  type: 'tags';
  key: string;
  category: any;
  [key: string]: ConstructValuesItem[] | 'tags' | string | any;
}

export function mapGroups(currSelection: { [key: string]: GroupValue }, valuesKey = 'values') {
  return Object.entries(currSelection || {}).reduce<MapGroupsItem[]>((acc, [groupKey, groupValue]) => {
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

export function constructGroups(allTags: AllTag[], item = 'item') {
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
