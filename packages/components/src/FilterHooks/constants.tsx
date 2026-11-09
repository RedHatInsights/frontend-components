import { useIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import React from 'react';

import { Badge } from '@patternfly/react-core/dist/dynamic/components/Badge';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import messages from '../messages';

export type Tag = {
  key: string;
  value: string;
};

type TagGroup = {
  count: number;
  tag: Tag;
};

export type FilterHookGroupItem = {
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
  item?: FilterHookGroupItem;
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
    const [key, entry] = curr;
    if (entry == null || typeof entry !== 'object' || !('isSelected' in entry)) {
      return acc;
    }
    const { isSelected, group, value, item } = entry;
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

const TagCount = ({ count, item }: { count: number; item?: string }) => {
  const intl = useIntlWithFallback();
  const tooltip =
    item === undefined
      ? intl.formatMessage(messages.tagFilterApplicableToItems, { count })
      : intl.formatMessage(messages.tagFilterApplicableToNamedItems, { count, item: `${item}${count === 1 ? '' : 's'}` });
  return (
    <Tooltip position="right" enableFlip content={tooltip}>
      <Badge isRead={count <= 0}>{intl.formatNumber(count)}</Badge>
    </Tooltip>
  );
};

export function constructGroups(allTags: AllTag[], item?: string) {
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
            {count !== undefined && <TagCount count={count} item={item} />}
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
