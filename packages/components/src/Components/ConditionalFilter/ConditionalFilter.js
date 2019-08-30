import React, { Component, Fragment } from 'react';
import { Dropdown, DropdownItem, DropdownToggle, SplitItem, Split } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import Text from './Text';
import { conditionalFilterType, typeMapper } from './constants';
import PropTypes from 'prop-types';

class ConditionalFilter extends Component {
    state = {
        isOpen: false
    }

    dropdownToggle = (isOpen) => {
        this.setState({
            isOpen
        });
    }

    render() {
        const { items, value, id, onChange, placeholder, ...props } = this.props;
        const { isOpen } = this.state;
        const activeItem = items && items.length && (
            items.find(item => item.value === value) ||
            items[0]
        );
        const ActiveComponent = activeItem && typeMapper(activeItem.type);
        return (
            <Fragment>
                {
                    !items || (items && items.length <= 0) ?
                        <Text { ...props }
                            value={ value }
                            id={ id || 'default-input' }
                            onChange={ (e) => onChange(e, e.target.value) }
                            placeholder={ placeholder }
                            widget-type='InsightsInput'
                        /> :
                        <Split>
                            <SplitItem>
                                <Dropdown
                                    onSelect={ () => this.dropdownToggle(false) }
                                    isOpen={ isOpen }
                                    toggle={
                                        <DropdownToggle onToggle={ this.dropdownToggle }>
                                            <FilterIcon size="sm" />
                                            <span className="ins-c-conditionalfiler">
                                                { activeItem && activeItem.label }
                                            </span>
                                        </DropdownToggle>
                                    }
                                    dropdownItems={
                                        items.map((item, key) => <DropdownItem
                                            key={ item.id ? `${item.id}-dropdown` : key }
                                            component="button"
                                            onClick={ e => onChange(e, item.value, item) }
                                            isHovered={ activeItem.label === item.label }
                                        >
                                            { item.label }
                                        </DropdownItem>)
                                    }
                                />
                            </SplitItem>
                            {
                                ActiveComponent && <SplitItem isFilled>
                                    <ActiveComponent
                                        placeholder={ placeholder || activeItem.placeholder || `Filter by ${activeItem.label}` }
                                        id={ (activeItem.filterValues && activeItem.filterValues.id) || activeItem.value }
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
                ]))
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
    items: [],
    onChange: () => undefined
};
export default ConditionalFilter;
