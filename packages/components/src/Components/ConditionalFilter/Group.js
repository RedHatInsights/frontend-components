import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption, SelectVariant, SelectGroup, Radio, Checkbox } from '@patternfly/react-core';
import Text from './Text';
import isEqual from 'lodash/isEqual';

export const groupType = {
    checkbox: 'checkbox',
    radio: 'radio',
    plain: 'plain'
};

class Group extends Component {
    state = {
        isExpanded: false,
        selected: {},
        filterBy: ''
    }

    onToggle = isExpanded => {
        this.setState({
            isExpanded
        });
    };

    componentDidUpdate({ selected: prevSelected }) {
        const { selected } = this.props;
        if (!isEqual(prevSelected, selected)) {
            this.setState({
                selected
            });
        }
    }

    mapItems = ({ groupValue, onSelect, groupLabel, groupId, type, items, ...group }, groupKey) => {
        const { onFilter } = this.props;
        const { filterBy } = this.state;
        let input;

        try {
            input = new RegExp(filterBy, 'i');
        } catch (err) {
            input = new RegExp(filterBy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        }

        return items.filter(item => onFilter || (
            (groupValue && input.test(groupValue)) ||
            (groupLabel && input.test(groupLabel)) ||
            (item.value && input.test(item.value)) ||
            (item.label && input.test(item.label))
        )
        ).map(({ value, isChecked, onClick, label, props: itemProps, id, ...item }, key) => (
            <SelectOption
                {...item}
                key={id || key}
                value={String(value || id || key)}
                onClick={e => {
                    if (e.target.tagName !== 'INPUT') {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    const clickedGroup = {
                        value: groupValue,
                        label: groupLabel,
                        id: groupId,
                        type,
                        items,
                        ...group
                    };
                    const clickedItem = { value, label, id, type, ...item };
                    const props = [
                        e,
                        clickedGroup,
                        clickedItem,
                        groupValue || groupKey,
                        value || key
                    ];

                    this.onSelect(...props);
                    onSelect && onSelect(...props);
                    onClick && onClick(...props);
                }}
            >
                {
                    type === groupType.checkbox &&
                    <Checkbox
                        {...itemProps}
                        label={label}
                        isChecked={
                            isChecked ||
                            this.isChecked(groupValue || groupKey, value || key) ||
                            false
                        }
                        onChange={(value, event) => {
                            item.onChange && item.onChange(value, event);
                        }}
                        name={item.name || value || `${groupKey}-${key}`}
                        id={id || value || `${groupKey}-${key}`}
                    />
                }
                {
                    type === groupType.radio &&
                    <Radio
                        isChecked={
                            isChecked ||
                            this.isChecked(groupValue || groupKey, value || key) ||
                            false
                        }
                        onChange={(value, event) => {
                            item.onChange && item.onChange(value, event);
                        }}
                        value={value || key}
                        name={item.name || value || `${groupKey}-${key}`}
                        label={label}
                        id={id || value || `${groupKey}-${key}`}
                    />
                }
                {(type !== groupType.checkbox && type !== groupType.radio) ? label : ''}
            </SelectOption>
        ));
    }

    calculateSelected = ({ type }, groupKey, itemKey) => {
        const { selected } = this.state;
        const { selected: propSelected } = this.props;
        const activeGroup = selected[groupKey] || propSelected[groupKey];
        if (activeGroup) {
            if (type !== groupType.radio && (
                activeGroup[itemKey] instanceof Object ? activeGroup[itemKey].isSelected : Boolean(activeGroup[itemKey])
            )) {
                return {
                    ...propSelected,
                    ...selected,
                    [groupKey]: {
                        ...activeGroup || {},
                        [itemKey]: false
                    }
                };
            }

            return {
                ...propSelected,
                ...selected,
                [groupKey]: {
                    ...type !== groupType.radio ? (activeGroup || {}) : {},
                    [itemKey]: true
                }
            };
        }

        return {
            ...propSelected,
            ...selected,
            [groupKey]: {
                [itemKey]: true
            }
        };
    }

    onSelect = (event, group, item, groupKey, itemKey) => {
        let newSelection = this.calculateSelected(group, groupKey, itemKey);

        const { onChange } = this.props;

        if (onChange) {
            onChange(event, newSelection, group, item, groupKey, itemKey);
            this.setState({ selected: {} });
        }

        this.setState({
            selected: newSelection
        });
    };

    isChecked = (groupValue, itemValue) => {
        const { selected: stateSelected } = this.state;
        const { selected: propSelected } = this.props;
        const selected = {
            ...propSelected,
            ...stateSelected
        };
        if (typeof selected[groupValue] === 'undefined') {
            return false;
        }

        return selected[groupValue][itemValue] instanceof Object ?
            selected[groupValue][itemValue].isSelected :
            Boolean(selected[groupValue][itemValue]);
    }

    customFilter = (e) => {
        const { onFilter } = this.props;
        const { target: { value } } = e;

        this.setState({ filterBy: value }, () => {
            onFilter && onFilter(value);
        });
    }

    clearSelection = () => {
        const { onFilter } = this.props;
        onFilter && onFilter('');
        this.setState({
            filterBy: '',
            isExpanded: false
        });
    }

    render() {
        const { isExpanded, filterBy } = this.state;
        const { groups, items, placeholder, className, selected, isFilterable, onFilter } = this.props;

        const filterItems = items || groups;

        return (<Fragment>
            { !filterItems || (filterItems && filterItems.length <= 0) ? <Text { ...this.props } value={ `${selected}` } /> : <Select
                className={ className }
                variant={ (isFilterable || onFilter) ? SelectVariant.typeahead : SelectVariant.single }
                aria-label="Select Input"
                onToggle={ this.onToggle }
                isExpanded={ isExpanded }
                onSelect={ () => undefined }
                placeholderText={ placeholder }
                onClear={this.clearSelection}
                { ...filterBy !== '' && { selections: [ filterBy ] } }
                { ...(isFilterable || onFilter) && { onFilter: this.customFilter } }
                { ...groups && groups.length > 0 && { isGrouped: true }}
            >
                { groups && groups.length > 0 ? (
                    groups.map(({ value: groupValue, onSelect, label: groupLabel, id: groupId, type, items, ...group }, groupKey) => {
                        const filteredItems = this.mapItems({ groupValue, onSelect, groupLabel, groupId, type, items, ...group }, groupKey);
                        return filteredItems.filter(Boolean).length > 0
                            ? <SelectGroup
                                {...group}
                                key={groupId || groupValue || groupKey}
                                value={groupId || groupValue || groupKey}
                                label={groupLabel}
                                id={groupId || `group-${groupValue || groupKey}`}
                            > {filteredItems} </SelectGroup>
                            : <Fragment/>;
                    })
                ) : (
                    this.mapItems({ items })
                ) }
            </Select> }
        </Fragment>);
    }
}

const itemsProps = PropTypes.arrayOf(
    PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.node,
        id: PropTypes.string,
        isChecked: PropTypes.bool,
        onClick: PropTypes.func,
        props: PropTypes.shape({
            [PropTypes.string]: PropTypes.any
        })
    })
);

Group.propTypes = {
    selected: PropTypes.shape({
        [PropTypes.string]: PropTypes.shape({
            [PropTypes.string]: PropTypes.oneOfType([
                PropTypes.bool,
                PropTypes.shape({
                    isSelected: PropTypes.bool
                })
            ])
        })
    }),
    onChange: PropTypes.func,
    groups: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.string,
        onSelect: PropTypes.func,
        type: PropTypes.oneOf(Object.values(groupType)),
        items: itemsProps
    })),
    items: itemsProps,
    isFilterable: PropTypes.bool,
    onFilter: PropTypes.func
};

Group.defaultProps = {
    selected: {},
    onChange: () => undefined,
    groups: [],
    isFilterable: false
};

export default Group;
