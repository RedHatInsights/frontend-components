import React, { Component, Fragment } from 'react';
import { Dropdown, DropdownItem, DropdownToggle, SplitItem, Split } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import Text from './Text';
import { conditionalFilterType, typeMapper } from './constants';
import PropTypes from 'prop-types';

class ConditionalFilter extends Component {
    state = {
        isOpen: false,
        stateValue: undefined
    }

    dropdownToggle = (isOpen) => {
        this.setState({
            isOpen
        });
    }

    onChange = (_e, value) => {
        this.setState({
            stateValue: value
        });
    }

    render() {
        const { items, value, id, onChange, placeholder, ...props } = this.props;
        const { isOpen, stateValue } = this.state;
        const currentValue = onChange ? value : stateValue;
        const activeItem = items && items.length && (
            items.find((item, key) => item.value === currentValue || key === currentValue) ||
            items[0]
        );
        const onChangeCallback = onChange || this.onChange;
        const ActiveComponent = activeItem && (typeMapper[activeItem.type] || typeMapper.text);
        return (
            <Fragment>
                {
                    !items || (items && items.length <= 0) ?
                        <div className="ins-c-conditional-filter">
                            <Text { ...props }
                                value={ currentValue }
                                id={ id || 'default-input' }
                                onChange={ (e) => onChangeCallback(e, e.target.value) }
                                placeholder={ placeholder }
                                widget-type='InsightsInput'
                            />
                        </div> :
                        <Split className="ins-c-conditional-filter">
                            { items.length > 1 &&
                                <SplitItem>
                                    <Dropdown
                                        className="ins-c-conditional-filter__group"
                                        onSelect={ () => this.dropdownToggle(false) }
                                        isOpen={ isOpen }
                                        toggle={
                                            <DropdownToggle onToggle={ this.dropdownToggle }>
                                                <FilterIcon size="sm" />
                                                <span className="ins-c-conditional-filter__value-selector">
                                                    { activeItem && activeItem.label }
                                                </span>
                                            </DropdownToggle>
                                        }
                                        dropdownItems={
                                            items.map((item, key) => <DropdownItem
                                                key={ item.id ? `${item.id}-dropdown` : key }
                                                component="button"
                                                onClick={ e => onChangeCallback(e, item.value || key, item) }
                                                isHovered={ activeItem.label === item.label }
                                            >
                                                { item.label }
                                            </DropdownItem>)
                                        }
                                    />
                                </SplitItem>
                            }
                            {
                                ActiveComponent && <SplitItem isFilled>
                                    <ActiveComponent
                                        {
                                        ...activeItem.type !== conditionalFilterType.custom &&
                                            {
                                                placeholder: placeholder || activeItem.placeholder || `Filter by ${activeItem.label.toLowerCase()}`,
                                                id: (activeItem.filterValues && activeItem.filterValues.id) || currentValue
                                            }
                                        }
                                        { ...activeItem.filterValues }
                                    />
                                </SplitItem>
                            }
                        </Split>
                }
            </Fragment>
        );
    }
}

const TextInputProps = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
};

ConditionalFilter.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.node,
        value: PropTypes.string,
        type: PropTypes.oneOf(Object.values(conditionalFilterType)),
        filterValues: PropTypes.oneOfType([ PropTypes.shape(TextInputProps), PropTypes.shape({
            ...TextInputProps,
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.arrayOf(PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.shape({
                        label: PropTypes.node,
                        value: PropTypes.string
                    })
                ])),
                PropTypes.shape({
                    [PropTypes.string]: PropTypes.any
                })
            ]),
            items: PropTypes.arrayOf(PropTypes.shape({
                label: PropTypes.node,
                value: PropTypes.string
            }))
        }) ])
    })),
    ...TextInputProps
};

ConditionalFilter.defaultProps = {
    value: '',
    items: []
};
export default ConditionalFilter;
