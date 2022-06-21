import React, { FormEvent, MouseEventHandler, useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import {
  Button,
  ButtonVariant,
  Checkbox,
  Menu,
  MenuContent,
  MenuItem,
  MenuGroup,
  MenuList,
  MenuToggle,
  Popper,
  Radio,
  TextInput,
  TreeView,
  TreeViewDataItem,
} from '@patternfly/react-core';
import { isChecked, calculateSelected, getGroupMenuItems, getMenuItems, convertTreeItem, mapTree, onTreeCheck } from './groupFilterConstants';
import groupType, { GroupType } from './groupType';
import './group-filter.scss';

export interface GroupFilterItem {
  /** Optional className. */
  className?: string;
  /** Optional identifier. */
  id?: string;
  /** isChecked flag. */
  isChecked?: boolean;
  /** Item label. */
  label?: Node | string;
  /** Item name. */
  name?: string;
  /** Optional noFilter flag. */
  noFilter?: boolean;
  /** Optional onChange event called on input change. */
  onChange?: (value: boolean, event: FormEvent<HTMLInputElement>) => void;
  /** onClick event callback. */
  onClick?: (e?: FormEvent | MouseEventHandler<HTMLInputElement>, item?: GroupFilterItem, key?: number, checked?: boolean) => void;
  /** Optional tagKey. */
  tagKey?: string;
  /** Optional tagValue. */
  tagValue?: string;
  /** Optional groupFilter item type. */
  type?: GroupType;
  /** Optional variant. */
  variant?: ButtonVariant;
  /** Item value. */
  value?: string;
}

export interface TreeViewItem extends GroupFilterItem {
  /** Optional hasCheck flag. */
  hasCheck?: boolean;
  /** Additional properties of the tree view item checkbox */
  checkProps?: Record<string, boolean | null>;
  /** Optional children items. */
  children?: TreeViewItem[];
  /** Optional item label. */
  label?: string;
  /** Optional item name. */
  name?: string;
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
  items: GroupFilterItem[];
  /** Optional label. */
  label?: string;
  /** Optional noFilter flag. */
  noFilter?: boolean;
  /** Optional group type. */
  type?: GroupType;
  /** Optional value. */
  value?: string;
}

export interface GroupFilterProps {
  /** Optional className. */
  className?: string;
  /** Optional filterBy key. */
  filterBy?: string;
  /** Optional groups. */
  groups?: Group[];
  /** Optional isFilterable flag. */
  isFilterable?: boolean;
  /** Optional groupFilter items. */
  items?: GroupFilterItem[];
  /** Optional onFilter callback. */
  onFilter?: (value: string) => void;
  /** onChange event called on input change. */
  onChange?: () => void;
  /** Optional callback on showMore button click. */
  onShowMore?: (event: React.MouseEvent | React.KeyboardEvent | MouseEvent) => void;
  /** Optional text filter placeholder. */
  placeholder?: string;
  /** Selected filters object. */
  selected?: Record<string, Record<string, boolean>>;
  /** Optional showMore button title element. */
  showMoreTitle?: React.ReactNode;
  /** Optional object containing properties for showMore element. */
  showMoreOptions?: Record<string, unknown>;
}

/**
 * Component that works as a group filter for ConditionalFilter component.
 *
 * It was not designed to be used as a standalone component.
 */
const GroupFilter: React.FunctionComponent<GroupFilterProps> = ({
  className,
  filterBy = '',
  groups = [],
  items,
  isFilterable,
  onFilter,
  onChange,
  onShowMore,
  placeholder,
  selected,
  showMoreTitle,
  showMoreOptions,
}) => {
  const [stateSelected, setStateSelected] = useState({});
  const [searchString, setSearchString] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    selected && setStateSelected(selected);
  }, [selected]);

  useEffect(() => {
    setSearchString(filterBy);
  }, [filterBy]);

  const handleMenuKeys = (event: KeyboardEvent) => {
    if (!isOpen) {
      return;
    }

    if (menuRef.current?.contains(event.target as Node) || toggleRef.current?.contains(event.target as Node)) {
      if (event.key === 'Escape' || event.key === 'Enter') {
        setIsOpen(!isOpen);
        toggleRef.current?.focus();
      }
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (isOpen && !menuRef.current?.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleMenuKeys);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleMenuKeys);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, menuRef]);

  const onToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation(); // Stop handleClickOutside from handling
    ev.persist();
    setIsOpen(!isOpen);
  };

  const menuItems = getMenuItems(
    items?.map((item) => (item.type === groupType.treeView ? convertTreeItem(item as TreeViewItem) : item)) || [],
    onChange,
    calculateSelected(selected || {})
  );
  const groupMenuItems = getGroupMenuItems(groups, onChange, calculateSelected(selected || {}));

  const renderItem = (item: GroupFilterItem, key: string | number, type?: GroupType, groupKey = '') => (
    <MenuItem
      itemId={key}
      key={`${item.value}-${key}-item`}
      className={item?.className}
      onClick={
        item.onClick && (type || item.type) === groupType.checkbox
          ? (e) => {
              item.onClick && item.onClick();
              e.preventDefault();
            }
          : undefined
      }
    >
      {(type || item.type) === groupType.treeView ? (
        <TreeView
          data={[mapTree(item as TreeViewItem, groupKey, stateSelected, selected || {})] as TreeViewDataItem[]}
          onCheck={(e, value) => onTreeCheck(e, value as TreeViewItem, [item as TreeViewItem])}
          hasChecks
        />
      ) : (type || item.type) === groupType.checkbox ? (
        <Checkbox
          {...item}
          label={item?.label}
          isChecked={item?.isChecked || isChecked(groupKey, item?.value || key, item?.id, item?.tagValue, stateSelected, selected || {}) || false}
          onChange={(value, event) => {
            item?.onChange?.(value, event);
          }}
          onClick={
            item.onClick
              ? (e) => {
                  item.onClick && item.onClick();
                  e.stopPropagation();
                }
              : undefined
          }
          name={item?.name || item?.value || `${groupKey}-${key}`}
          id={item?.id || item?.value || `${groupKey}-${key}`}
        />
      ) : (type || item.type) === groupType.radio ? (
        <Radio
          {...item}
          isChecked={item?.isChecked || isChecked(groupKey, item?.value || key, item?.id, item?.tagValue, stateSelected, selected || {}) || false}
          onChange={(value, event) => {
            item?.onChange?.(value, event);
          }}
          value={item?.value || key}
          name={item?.name || item?.value || `${groupKey}-${key}`}
          label={item?.label || ''}
          id={item?.id || item?.value || `${groupKey}-${key}`}
        />
      ) : (type || item.type) === groupType.button ? (
        <Button id={item.id} className={`pf-c-select__option-button ${item?.className || ''}`} variant={item?.variant} onClick={item.onClick}>
          {item?.label}
        </Button>
      ) : (
        item?.label || ''
      )}
    </MenuItem>
  );

  const renderItems = (items: GroupFilterItem[], type?: GroupType, groupKey = '') =>
    items.map((item, key) =>
      (type || item.type) === groupType.treeView ? (
        <div key={`${item.value}-${key}-item`} className="ins-c-tree-view">
          {renderItem(item as TreeViewItem, key, type, groupKey)}
        </div>
      ) : (
        renderItem(item, key, type, groupKey)
      )
    );
  return (
    <div ref={containerRef}>
      <Popper
        appendTo={containerRef.current as HTMLElement}
        trigger={
          <MenuToggle aria-label="Group filter" ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen} className={className}>
            {isFilterable || onFilter ? (
              <TextInput
                aria-label="input with dropdown and clear button"
                placeholder={placeholder}
                value={searchString}
                tabIndex={0}
                onChange={(value) => {
                  setSearchString(value);
                  onFilter?.(value);
                }}
                type="search"
              />
            ) : (
              placeholder
            )}
          </MenuToggle>
        }
        popper={
          <Menu ref={menuRef} className={classNames('ins-c-menu__scrollable', className, { 'pf-m-expanded': isOpen })}>
            <MenuContent>
              <MenuList aria-label="Group filter">
                {menuItems.length > 0 && <MenuGroup>{renderItems(menuItems as GroupFilterItem[])}</MenuGroup>}
                {groupMenuItems.map((group: GroupFilterItem | Group, groupKey: number) => (
                  <MenuGroup
                    label={(group as Group).groupSelectable && typeof group.label === 'string' ? group.label : undefined}
                    key={`${group.label}-${groupKey}-group`}
                  >
                    {renderItems((group as Group).items, group.type, group.value)}
                  </MenuGroup>
                ))}
                {onShowMore ? (
                  <MenuItem itemId="loader" className="ins-c-menu__show--more" {...showMoreOptions} onClick={(e) => onShowMore(e)}>
                    {showMoreTitle}
                  </MenuItem>
                ) : (
                  // @ts-expect-error: value="" is a PF issue fix
                  <span hidden value=""></span>
                )}
              </MenuList>
            </MenuContent>
          </Menu>
        }
        isVisible={isOpen}
      />
    </div>
  );
};

export default GroupFilter;
