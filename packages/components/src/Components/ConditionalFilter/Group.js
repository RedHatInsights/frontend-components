import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption, SelectVariant, SelectGroup, Radio, Checkbox } from '@patternfly/react-core';
import Text from './Text';

export const groupType = {
    checkbox: 'checkbox',
    radio: 'radio',
    plain: 'plain'
};

class Group extends Component {
    state = {
        isExpanded: false,
        selected: {}
    }

    onToggle = isExpanded => {
        this.setState({
            isExpanded
        });
    };

    calculateSelected = ({ type }, groupKey, itemKey) => {
        const { selected } = this.state;
        const { selected: propSelected } = this.props;
        const activeGroup = selected[groupKey] || propSelected[groupKey];
        if (activeGroup) {
            if (type !== groupType.radio && activeGroup[itemKey]) {
                return {
                    ...selected,
                    [groupKey]: {
                        ...activeGroup || {},
                        [itemKey]: false
                    }
                };
            }

            return {
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
        const newSelection = this.calculateSelected(group, groupKey, itemKey);
        const { onChange } = this.props;
        onChange(event, newSelection, group, item);
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

        return Boolean(selected[groupValue][itemValue]);
    }

    render() {
        const { isExpanded } = this.state;
        const { groups, placeholder, className, selected } = this.props;

        return (<Fragment>
            { !groups || (groups && groups.length <= 0) ? <Text { ...this.props } value={ `${selected}` } /> : <Select
                className={ className }
                variant={ SelectVariant.single }
                aria-label="Select Input"
                onToggle={ this.onToggle }
                isExpanded={ isExpanded }
                onSelect={ () => undefined }
                placeholderText={ placeholder }
                isGrouped
            >
                { groups.map(({ value: groupValue, onSelect, label: groupLabel, id: groupId, type, items, ...group }, groupKey) => (
                    <SelectGroup
                        { ...group }
                        key={ groupId || groupValue || groupKey }
                        label={ groupLabel }
                        id={ groupId || `group-${groupValue || groupKey}` }
                    >
                        {items && items.map(({ value, isChecked, onClick, label, props: itemProps, id, ...item }, key) => (
                            <SelectOption
                                { ...item }
                                key={id || key}
                                value={String(value || id || key)}
                                onClick={e => {
                                    if (e.target.tagName === 'LABEL') {
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
                                    const clickedItem = { value, label, id, type, ...group };
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
                                        { ...itemProps }
                                        label={ label }
                                        isChecked={
                                            isChecked ||
                                            this.isChecked(groupValue || groupKey, value || key) ||
                                            false
                                        }
                                        onChange={(value, event) => {
                                            item.onChange && item.onChange(value, event);
                                        }}
                                        name={ item.name || value || `${groupKey}-${key}` }
                                        id={ id || value || `${groupKey}-${key}` }
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
                                        value={ value || key }
                                        name={item.name || value || `${groupKey}-${key}`}
                                        label={ label }
                                        id={ id || value || `${groupKey}-${key}` }
                                    />
                                }
                                { (type !== groupType.checkbox && type !== groupType.radio) ? label : '' }
                            </SelectOption>
                        )) }
                    </SelectGroup>)
                ) }
            </Select> }
        </Fragment>);
    }
}

Group.propTypes = {
    selected: PropTypes.shape({
        [PropTypes.string]: PropTypes.shape({
            [PropTypes.string]: PropTypes.bool
        })
    }),
    onChange: PropTypes.func,
    groups: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.string,
        onSelect: PropTypes.func,
        type: PropTypes.oneOf(Object.values(groupType)),
        items: PropTypes.arrayOf(
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
        )
    }))
};

Group.defaultProps = {
    selected: {},
    onChange: () => undefined,
    groups: []
};

export default Group;
