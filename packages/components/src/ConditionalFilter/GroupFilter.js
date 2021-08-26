import React, { useCallback, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    TextInput,
    MenuList,
    MenuItem,
    MenuGroup,
    Checkbox,
    Button,
    MenuToggle,
    Menu,
    MenuContent,
    Popper,
    Radio
} from '@patternfly/react-core';
import { groupType, isChecked, calculateSelected, getGroupMenuItems, getMenuItems } from './groupFilterConstants';
const Group = ({
    placeholder,
    onShowMore,
    showMoreTitle,
    showMoreOptions,
    items,
    filterBy,
    onFilter,
    className,
    groups = [],
    onChange,
    selected,
    isFilterable
}) => {
    const [ stateSelected, setStateSelected ] = useState({});
    const [ searchString, setSearchString ] = useState('');
    const [ isOpen, setIsOpen ] = useState(false);
    const toggleRef = useRef();
    const menuRef = useRef();

    useEffect(() => {
        setStateSelected(selected);
    }, [ selected ]);

    const calculateSelection = useCallback(calculateSelected, [ stateSelected ]);

    useEffect(() => {
        setSearchString(filterBy);
    }, [ filterBy ]);

    const handleMenuKeys = event => {
        if (!isOpen) {
            return;
        }

        if (menuRef.current.contains(event.target) || toggleRef.current.contains(event.target)) {
            if (event.key === 'Escape' || event.key === 'Enter') {
                setIsOpen(!isOpen);
                toggleRef.current.focus();
            }
        }
    };

    const handleClickOutside = event => {
        if (isOpen && !menuRef.current.contains(event.target)) {
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
    }, [ isOpen, menuRef ]);

    const onToggleClick = ev => {
        ev.stopPropagation(); // Stop handleClickOutside from handling
        ev.persist();
        if (!(isOpen && toggleRef.current.contains(ev.target))) {
            setIsOpen(!isOpen);
        }
    };

    const groupMenuItems = getGroupMenuItems(groups, onChange, calculateSelection(selected));
    const menuItems = getMenuItems(items, onChange, calculateSelection(selected));

    // eslint-disable-next-line react/prop-types
    const renderItems = (items, type, groupKey = '') => items.map((item, key) => (<MenuItem
        itemId={key}
        key={`${item.value}-${key}-item`}
        className={item?.className}
    >
        {
            (type || item.type) === groupType.checkbox ?
                <Checkbox
                    {...item}
                    label={item?.label}
                    isChecked={
                        item?.isChecked ||
                        isChecked(
                            groupKey,
                            item?.value  || key,
                            item?.id,
                            item?.tagValue,
                            stateSelected,
                            selected
                        ) ||
                        false
                    }
                    onChange={(value, event) => {
                        item?.onChange?.(value, event);
                    }}
                    name={item?.name || item?.value || `${groupKey}-${key}`}
                    id={item?.id || item?.value || `${groupKey}-${key}`}
                /> :
                (type || item.type) === groupType.radio ?
                    <Radio {...item}
                        isChecked={
                            item?.isChecked ||
                        isChecked(
                            groups?.value || groupKey,
                            item?.value || key,
                            item?.id,
                            item?.tagValue,
                            stateSelected,
                            selected
                        ) ||
                        false
                        }
                        onChange={(value, event) => {
                            item.onChange && item.onChange(value, event);
                        }}
                        value={item?.value || key}
                        name={item?.name || item?.value || `${groupKey}-${key}`}
                        label={item?.label || ''}
                        id={item?.id || item?.value || `${groupKey}-${key}`}
                    /> :
                    (type || item.type) === groupType.button ?
                        <Button
                            {...item}
                            className={`pf-c-select__option-button ${item?.className || ''}`}
                            variant={item?.variant}
                            onClick={item.onClick}
                        >
                            {item?.label}
                        </Button> :
                        (item?.label || '')
        }
    </MenuItem>));

    return <Popper trigger={(
        <MenuToggle
            ref={toggleRef}
            onClick={onToggleClick}
            isExpanded={isOpen}
            className={className}
        >
            {(isFilterable || onFilter) ? <TextInput aria-label="input with dropdown and clear button"
                placeholder={placeholder}
                value={searchString}
                tabIndex={0}
                onChange={(value) => {
                    setSearchString(value);
                    onFilter?.(value);
                }}
                type="search"
            /> : placeholder }
        </MenuToggle>
    )} popper={(
        <Menu
            ref={menuRef}
            className={classNames(className, { 'pf-m-expanded': isOpen })}
        >
            <MenuContent>
                <MenuList>
                    {menuItems.length > 0 && (
                        <MenuGroup>
                            {renderItems(items)}
                        </MenuGroup>
                    )}
                    {groupMenuItems.map((group, groupKey) => (
                        <MenuGroup label={group.label} key={`${group.label}-${groupKey}-group`}>
                            {renderItems(group.items, group.type, group.value, group)}
                        </MenuGroup>
                    ))}
                    { onShowMore ?
                        <MenuItem
                            itemId="loader"
                            className="ins-c-menu__show--more"
                            {...showMoreOptions}
                            onClick={(e) => {
                                setIsOpen(false);
                                onShowMore(e);
                            }}
                        >
                            {showMoreTitle}
                        </MenuItem>
                        : <span hidden value=""></span>}
                </MenuList>
            </MenuContent>
        </Menu>
    )} isVisible={isOpen} />;
};

Group.propTypes = {
    placeholder: PropTypes.string,
    onShowMore: PropTypes.func,
    showMoreTitle: PropTypes.node,
    onShowMoreTitle: PropTypes.func,
    showMoreOptions: PropTypes.any,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        value: PropTypes.string,
        label: PropTypes.node
    })),
    className: PropTypes.string,
    selected: PropTypes.shape({
        [PropTypes.string]: PropTypes.shape({
            [PropTypes.string]: PropTypes.shape({
                [PropTypes.string]: PropTypes.any
            })
        })
    }),
    isFilterable: PropTypes.bool,
    filterBy: PropTypes.string,
    onFilter: PropTypes.func,
    groups: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf(Object.keys(groupType)),
            value: PropTypes.string,
            label: PropTypes.node,
            items: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string,
                    tagKey: PropTypes.string
                })
            )
        })
    ),
    onChange: PropTypes.func.isRequired,
    selectedTags: PropTypes.shape({})
};

export default Group;
