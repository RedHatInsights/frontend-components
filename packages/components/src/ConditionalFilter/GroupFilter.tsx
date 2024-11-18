import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  Button,
  Checkbox,
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuToggle,
  Popper,
  Radio,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  TreeView,
  TreeViewDataItem,
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import {
  FilterMenuItemOnChange,
  Group,
  GroupFilterItem,
  TreeViewItem,
  calculateSelected,
  convertTreeItem,
  getGroupMenuItems,
  getMenuItems,
  isButtonItem,
  isCheckboxItem,
  isChecked,
  isRadioItem,
  isTreeViewItem,
  mapTree,
  onTreeCheck,
} from './groupFilterConstants';
import GroupType from './groupType';
import './group-filter.scss';
import { GroupItem } from './groupFilterConstants';

type FilterableProps = {
  /** Optional isFilterable flag. */
  isFilterable: true;
  /** Optional onFilter callback. */
  onFilter: (value: string) => void;
};

export type GroupFilterProps = {
  /** Optional className. */
  className?: string;
  /** Optional filterBy key. */
  filterBy?: string;
  /** Optional groups. */
  groups?: Group[];
  /** Optional groupFilter items. */
  items?: GroupFilterItem[];
  /** onChange event called on input change. */
  onChange: FilterMenuItemOnChange;
  /** Optional callback on showMore button click. */
  onShowMore?: (event: React.MouseEvent | React.KeyboardEvent | MouseEvent) => void;
  /** Optional text filter placeholder. */
  placeholder?: string;
  /** Selected filters object. */
  selected?: Record<string, Record<string, GroupItem | boolean>>;
  /** Optional showMore button title element. */
  showMoreTitle?: React.ReactNode;
  /** Optional object containing properties for showMore element. */
  showMoreOptions?: Record<string, unknown>;
  /** Optional boolean to disable the dropdown and text filter. */
  isDisabled?: boolean;
} & (
  | FilterableProps
  | {
      isFilterable?: false;
      // not required and only accepts undefined if isFilterable is set to false
      onFilter?: undefined;
    }
);

/**
 * Component that works as a group filter for ConditionalFilter component.
 *
 * You can either pass flat config using `items` to it. Or supply `groups` array to show groups with titles.
 *
 * You can even mix match them (items will be rendered before groups).
 *
 * It was not designed to be used as a standalone component, but rather within conditionalFilter.
 */
const GroupFilter: React.FunctionComponent<GroupFilterProps> = (props) => {
  const {
    className,
    filterBy = '',
    groups = [],
    items = [],
    isFilterable,
    onChange,
    onShowMore,
    placeholder,
    selected,
    showMoreTitle,
    showMoreOptions,
    isDisabled,
    onFilter,
  } = props;
  const [searchString, setSearchString] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (!isOpen) return;

    const clickedInsideInput = inputRef.current?.contains(event.target as Node);
    const clickedInsideMenu = menuRef.current?.contains(event.target as Node);
    const clickedToggle = toggleRef.current?.contains(event.target as Node);

    if (clickedInsideInput || clickedInsideMenu || clickedToggle) return;
    setIsOpen(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleMenuKeys);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleMenuKeys);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, menuRef]);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = getMenuItems(
    items?.map((item) => (item.type === GroupType.treeView ? convertTreeItem(item) : item)) || [],
    onChange,
    calculateSelected(selected || {})
  );
  const groupMenuItems = getGroupMenuItems(groups, onChange, calculateSelected(selected || {}));

  const renderItem = ({ groupSelectable, ...item }: GroupFilterItem, key: string | number, type?: GroupType, groupKey = '') => (
    <MenuItem
      itemId={key}
      key={`${item.value}-${key}-item`}
      className={item?.className}
      onClick={
        isCheckboxItem(type, item)
          ? (e) => {
              item.onClick?.(e);
              e.preventDefault();
            }
          : undefined
      }
    >
      {isTreeViewItem(type, item) ? (
        <TreeView
          data={[mapTree(item, groupKey, selected || {})] as TreeViewDataItem[]}
          onCheck={(e, value) => onTreeCheck(e, value as TreeViewItem, [item as TreeViewItem])}
          hasCheckboxes
        />
      ) : isCheckboxItem(type, item) ? (
        <Checkbox
          {...item}
          label={item?.label}
          isChecked={item?.isChecked || isChecked(groupKey, item?.value || key, item?.id, item?.tagValue, selected || {}) || false}
          onChange={item.onChange}
          onClick={
            item.onClick
              ? (e) => {
                  item.onClick?.(e);
                  e.stopPropagation();
                }
              : undefined
          }
          name={item?.name || item?.value || `${groupKey}-${key}`}
          id={item?.id || item?.value || `${groupKey}-${key}`}
        />
      ) : isRadioItem(type, item) ? (
        <Radio
          {...item}
          isChecked={item?.isChecked || isChecked(groupKey, item.value, item?.id, item?.tagValue, selected || {}) || false}
          onChange={item.onChange}
          value={item?.value || key}
          name={item?.name || item?.value || `${groupKey}-${key}`}
          label={item?.label || ''}
          id={item?.id || item?.value || `${groupKey}-${key}`}
        />
      ) : isButtonItem(type, item) ? (
        <Button id={item.id} className={classNames('pf-v5-c-select__option-button', item.className)} variant={item.variant} onClick={item.onClick}>
          {item.label}
        </Button>
      ) : (
        item?.label || ''
      )}
    </MenuItem>
  );

  const renderItems = (items: GroupFilterItem[], type?: GroupType, groupKey = '') =>
    items.map((item, key) =>
      (type || item.type) === GroupType.treeView ? (
        <div key={`${item.value}-${key}-item`} className="ins-c-tree-view">
          {renderItem(item as TreeViewItem, key, type, groupKey)}
        </div>
      ) : (
        renderItem(item, key, type, groupKey)
      )
    );

  const hasFocus = document.activeElement === inputRef.current || document.activeElement === toggleRef.current;
  const searchDirty = hasFocus && searchString?.length > 0;

  const setFilter = (value: string) => {
    setSearchString(value);
    onFilter?.(value);
  };

  return (
    <div ref={containerRef}>
      <Popper
        appendTo={containerRef.current as HTMLElement}
        trigger={
          <MenuToggle
            aria-label="Group filter"
            innerRef={toggleRef}
            onClick={onToggleClick}
            isExpanded={isOpen}
            className={classNames('ins-c-group-menu-toggle', className, {
              // turn off extra padding if filter input is within the input
              'pf-v5-u-p-0': isFilterable,
            })}
            isDisabled={isDisabled}
            variant={isFilterable || onFilter ? 'typeahead' : 'default'}
          >
            {isFilterable || onFilter ? (
              <TextInputGroup isDisabled={isDisabled} isPlain>
                <TextInputGroupMain
                  autoComplete="off"
                  innerRef={inputRef}
                  onClick={onToggleClick}
                  onChange={(_e, value) => {
                    setFilter(value);
                  }}
                  aria-label="input with dropdown and clear button"
                  placeholder={placeholder}
                  value={searchString}
                  type="text"
                />
                <TextInputGroupUtilities>
                  {searchDirty && (
                    <Button
                      variant="plain"
                      onClick={() => {
                        setFilter('');
                        setIsOpen(false);
                      }}
                      aria-label="Clear input value"
                    >
                      <TimesIcon aria-hidden />
                    </Button>
                  )}
                </TextInputGroupUtilities>
              </TextInputGroup>
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
                {groupMenuItems.map((group, groupKey) => (
                  <MenuGroup
                    label={!(group as Group).groupSelectable && typeof group.label === 'string' ? group.label : undefined}
                    key={`${group.label}-${groupKey}-group`}
                  >
                    {group.items && renderItems(group.items, group.type, group.value)}
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
