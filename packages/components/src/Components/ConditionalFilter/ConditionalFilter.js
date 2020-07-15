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
        const { items, value, id, onChange, placeholder, hideLabel, isDisabled, ...props } = this.props;
        const { isOpen, stateValue } = this.state;
        const currentValue = onChange ? value : stateValue;
        const activeItem = items && items.length && (
            items.find((item, key) => item.value === currentValue || key === currentValue) ||
            items[0]
        );
        const onChangeCallback = onChange || this.onChange;
        const ActiveComponent = activeItem && (typeMapper[activeItem.type] || typeMapper.text);
        const capitalize = (string) => string[0].toUpperCase() + string.substring(1);
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
                                            <DropdownToggle
                                                onToggle={ this.dropdownToggle }
                                                isDisabled={ isDisabled }
                                                className={ hideLabel ? 'ins-c-conditional-filter__no-label' : '' } >
                                                <FilterIcon size="sm" />
                                                { !hideLabel &&
                                                    <span className="ins-c-conditional-filter__value-selector">
                                                        { activeItem && capitalize(activeItem.label) }
                                                    </span>
                                                }
                                            </DropdownToggle>
                                        }
                                        dropdownItems={
                                            items.map((item, key) => <DropdownItem
                                                key={ item.id ? `${item.id}-dropdown` : key }
                                                component="button"
                                                onClick={ e => onChangeCallback(e, item.value || key, item) }
                                                isHovered={ activeItem.label === item.label }
                                            >
                                                { capitalize(item.label) }
                                            </DropdownItem>)
                                        }
                                    />
                                </SplitItem>
                            }
                            {
                                ActiveComponent && <SplitItem isFilled>
                                    <ActiveComponent
                                        onShowMore={activeItem.onShowMore}
                                        showMoreTitle={activeItem.showMoreTitle}
                                        {
                                        ...activeItem.type !== conditionalFilterType.custom &&
                                            {
                                                placeholder: placeholder || activeItem.placeholder || `Filter by ${activeItem.label}`,
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
    hideLabel: PropTypes.bool,
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
    ...TextInputProps,
    isDisabled: PropTypes.bool
};

ConditionalFilter.defaultProps = {
    value: '',
    items: [],
    hideLabel: false,
    isDisabled: false
};
export default ConditionalFilter;
