import React, { ChangeEvent, ReactNode } from 'react';
import GroupType from './groupType';
import { ButtonProps } from '@patternfly/react-core/dist/dynamic/components/Button';
import { ButtonVariant } from '@patternfly/react-core/dist/dynamic/components/Button';
import { CheckboxProps } from '@patternfly/react-core/dist/dynamic/components/Checkbox';
import { RadioProps } from '@patternfly/react-core/dist/dynamic/components/Radio';

export interface GroupItem {
  /** Optional isSelected flag */
  isSelected?: boolean;
  /** Reference back to the group */
  group: Group;
  /** Current group filter item */
  item: GroupFilterItem;
}

export interface Group {
  /** Optional groupSelectable flag. */
  groupSelectable?: boolean;
  /** Optional id. */
  id?: string;
  /** Optional isSelected flag. */
  isSelected?: boolean;
  /** Optional item. */
  item?: GroupFilterItem;
  /** Group item array. */
  items?: GroupFilterItem[];
  /** Optional label. */
  label: string;
  /** Optional noFilter flag. */
  noFilter?: boolean;
  /** Optional group type. */
  type?: GroupType;
  /** Optional value. */
  value?: string;
}

type ExtraCheckboxAttributes = {
  type: GroupType.checkbox;
  onChange?: CheckboxProps['onChange'];
  onClick?: CheckboxProps['onClick'];
};

type ExtraButtonAttributes = {
  type: GroupType.button;
  /** Optional variant. */
  variant?: ButtonVariant;
  onClick?: NonNullable<ButtonProps['onClick']>;
};

type ExtraRadioAttributes = {
  type: GroupType.radio;
  isChecked?: boolean;
  onChange?: RadioProps['onChange'];
};

type ExtraTreeViewAttributes = {
  type: GroupType.treeView;
  /** Optional hasCheck flag. */
  hasCheck?: boolean;
  /** Additional properties of the tree view item checkbox */
  checkProps?: Record<string, boolean | null>;
  /** Optional children items. */
  children: TreeViewItem[];
  /** Optional item label. */
  label: string;
  /** Optional item name. */
  name?: string;
};

export type GroupFilterItem = {
  /** Optional className. */
  className?: string;
  /** Optional identifier. */
  id?: string;
  /** isChecked flag. */
  isChecked?: boolean;
  /** Item label. */
  label: ReactNode;
  /** Item name. */
  name?: string;
  /** Optional noFilter flag. */
  noFilter?: boolean;
  /** Optional onChange event called on input change. */
  // onChange?: (value: boolean, event: FormEvent<HTMLInputElement>) => void;
  /** Optional tagKey. */
  tagKey?: string;
  /** Optional tagValue. */
  tagValue?: string;
  /** Item value. */
  value: string;
  groupSelectable?: boolean;
} & (
  | ExtraButtonAttributes
  | ExtraCheckboxAttributes
  | ExtraRadioAttributes
  | ExtraTreeViewAttributes
  | {
      type?: GroupType.plain;
    }
);

export type TreeViewItem = GroupFilterItem & Omit<ExtraTreeViewAttributes, 'type' | 'children'> & { children?: TreeViewItem[] };

export function isCheckboxItem(type?: GroupType, item?: GroupFilterItem): item is GroupFilterItem & ExtraCheckboxAttributes {
  return type === GroupType.checkbox || item?.type === GroupType.checkbox;
}

export function isButtonItem(type?: GroupType, item?: GroupFilterItem): item is GroupFilterItem & ExtraButtonAttributes {
  return type === GroupType.button || item?.type === GroupType.button;
}

export function isRadioItem(type?: GroupType, item?: GroupFilterItem): item is GroupFilterItem & ExtraRadioAttributes {
  return type === GroupType.radio || item?.type === GroupType.radio;
}

export function isTreeViewItem(type?: GroupType, item?: GroupFilterItem): item is GroupFilterItem & ExtraTreeViewAttributes {
  return type === GroupType.treeView || item?.type === GroupType.treeView;
}

function isGroup(item: boolean | GroupItem): item is GroupItem {
  return (item as GroupItem)?.group !== undefined;
}

export const isChecked = (
  groupValue: string,
  itemValue: string | number,
  id: string | undefined,
  tagValue: string | undefined,
  propSelected: Record<string, Record<string, boolean | GroupItem>>
) => {
  const selected = {
    ...propSelected,
  };

  if (typeof selected[groupValue] === 'undefined') {
    return false;
  }

  if (isGroup(selected[groupValue][itemValue])) {
    const group = selected[groupValue][itemValue] as GroupItem;
    if (group.isSelected) {
      if (group?.item?.id) {
        return id === group?.item?.id;
      } else if (group?.item?.tagValue) {
        return tagValue === group?.item?.tagValue;
      }
    }

    return Boolean(group.isSelected);
  }

  return Boolean(selected[groupValue][itemValue]);
};

export type FilterMenuItemOnChange = (
  event: React.FormEvent | React.MouseEventHandler,
  selected: Record<string, Record<string, GroupItem | boolean>>,
  selectedItem: {
    value: string;
    label: string | ReactNode;
    id: string;
    type: unknown;
    items: GroupFilterItem[];
  },
  item: {
    id?: string;
    value?: string;
  },
  value: string,
  itemValue: string
) => void;

export const getMenuItems = (
  items: GroupFilterItem[],
  onChange: FilterMenuItemOnChange | undefined,
  calculateSelected: (
    type?: GroupType,
    groupKey?: string,
    value?: TreeViewItem | string,
    checked?: boolean
  ) => Record<string, Record<string, boolean | GroupItem>>,
  groupType?: GroupType,
  groupValue = '',
  groupLabel?: string,
  groupId?: string,
  group?: Group
): GroupFilterItem[] => {
  const result =
    items.map((item: GroupFilterItem, index: number) => ({
      ...item,
      className: `${item?.className || 'pf-v5-u-pl-sm'}`,
      value: String(item.value || item.id || index),
      onClick: (event: React.FormEvent | React.MouseEventHandler, treeViewItem?: TreeViewItem, checked?: boolean) => {
        const params: [
          React.FormEvent | React.MouseEventHandler,
          Record<string, Record<string, GroupItem | boolean>>,
          {
            value: string;
            label: string | ReactNode;
            id: string;
            type: unknown;
            items: GroupFilterItem[];
          },
          {
            id?: string;
            value?: string;
          },
          string,
          string
        ] = [
          event,
          calculateSelected(groupType || item.type, groupValue, (groupType || item.type) === GroupType.treeView ? treeViewItem : item.value, checked),
          {
            value: groupValue,
            id: (groupId || item.id) as string,
            type: groupType || item.type,
            items,
            ...(group || item),
            label: (groupLabel || item.label) as string,
          },
          item,
          groupValue,
          item.value as string,
        ];
        onChange?.(...params);
        // FIXME: fix types
        (item as any)?.onClick?.(event, { ...item, label: typeof item.label === 'string' ? item.label : '' }, undefined, checked);
      },
    })) || [];

  return result.filter(({ noFilter }) => !noFilter);
};

export const convertTreeItem = (item: TreeViewItem): TreeViewItem => {
  item.id = item.id || item.value;
  item.name = item.label || item.name;
  item.value = item.id;
  item.label = item.name || '';

  return item.children
    ? {
        ...item,
        children: item.children.map((child) => convertTreeItem(child)),
      }
    : item;
};

export const getGroupMenuItems = (
  groups: Group[],
  onChange: FilterMenuItemOnChange | undefined,
  calculateSelected: (
    type?: GroupType,
    groupKey?: string,
    value?: TreeViewItem | string,
    checked?: boolean
  ) => Record<string, Record<string, boolean | GroupItem>>
): Group[] => {
  const result = groups.map((group) => {
    const { value, label, groupSelectable, id, type, items, noFilter } = group;
    let converted = type === GroupType.treeView && items ? items.map((item: GroupFilterItem) => convertTreeItem(item as TreeViewItem)) : items || [];
    if (groupSelectable) {
      const artificialGroupItem: GroupFilterItem = {
        value: value || '',
        id: id || '',
        className: 'pf-v5-u-pl-xs',
        ...group,
        type: group.type || GroupType.plain,
      } as GroupFilterItem;
      converted = [artificialGroupItem, ...converted];
    }
    return {
      label,
      noFilter,
      value,
      type,
      groupSelectable,
      items: getMenuItems(converted, onChange, calculateSelected, type, value, label, id, group),
    };
  });
  return result.filter(({ noFilter, items = [] }) => !noFilter || items.length > 0);
};

export const calculateSelected =
  (selectedTags: Record<string, Record<string, GroupItem | boolean>>) =>
  (type = GroupType.button, groupKey = '', value: TreeViewItem | string = '', checked = false) => {
    const activeGroup = selectedTags?.[groupKey];
    const children =
      type === GroupType.treeView
        ? [value as TreeViewItem].reduce(function iter(acc: TreeViewItem[], curr: TreeViewItem): TreeViewItem[] {
            if (Array.isArray(curr?.children)) {
              return curr.children.reduce(iter, acc) || [];
            }

            acc.push(curr);
            return acc;
          }, [])
        : [];

    const itemKeys = type === GroupType.treeView ? children.map((item: TreeViewItem) => item.id) : [String(value)];

    if (activeGroup) {
      let result = selectedTags;
      itemKeys.map((itemKey = '') => {
        const activeGroup = result[groupKey];
        if (
          type !== GroupType.radio &&
          (activeGroup[itemKey] instanceof Object ? (activeGroup[itemKey] as GroupItem).isSelected : Boolean(activeGroup[itemKey]))
        ) {
          result = {
            ...result,
            [groupKey]: {
              ...(activeGroup || {}),
              [itemKey]: type === GroupType.treeView && checked,
            },
          };
        } else {
          result = {
            ...result,
            [groupKey]: {
              ...(type !== GroupType.radio ? activeGroup || {} : {}),
              [itemKey]: true,
            },
          };
        }
      });
      return result;
    }

    return itemKeys.reduce(
      (acc, curr) => ({
        ...acc,
        [groupKey]: {
          ...acc?.[groupKey],
          [curr || '']: true,
        },
      }),
      selectedTags
    );
  };

const areAllChildrenChecked = (dataItem: TreeViewItem, groupKey: string, selected: Record<string, Record<string, boolean | GroupItem>>): boolean =>
  dataItem.children
    ? dataItem.children.every((child: TreeViewItem) => areAllChildrenChecked(child, groupKey, selected))
    : isChecked(groupKey, dataItem.id || '', undefined, undefined, selected);

const areSomeChildrenChecked = (dataItem: TreeViewItem, groupKey: string, selected: Record<string, Record<string, boolean | GroupItem>>): boolean =>
  dataItem.children
    ? dataItem.children.some((child: TreeViewItem) => areSomeChildrenChecked(child, groupKey, selected))
    : isChecked(groupKey, dataItem.id || '', undefined, undefined, selected);

export const mapTree = (item: TreeViewItem, groupKey: string, selected: Record<string, Record<string, boolean | GroupItem>>): TreeViewItem => {
  const hasCheck = areAllChildrenChecked(item, groupKey, selected);
  item.checkProps = { checked: false };

  if (hasCheck) {
    item.checkProps.checked = true;
  } else {
    const hasPartialCheck = areSomeChildrenChecked(item, groupKey, selected);
    if (hasPartialCheck) {
      item.checkProps = { checked: null };
    }
  }

  if (item.children) {
    return {
      ...item,
      children: item.children.map((child: TreeViewItem) => mapTree(child, groupKey, selected)),
    };
  }

  return item;
};

// FIXME: Fix types
export const onTreeCheck = (e: ChangeEvent, treeViewItem: TreeViewItem, tree: TreeViewItem[]) =>
  (tree[0] as any).onClick?.(e, treeViewItem, undefined, (e?.target as HTMLInputElement)?.checked);
