import React, { Component } from 'react';
import { Dropdown, DropdownToggle } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import FilterInput from './FilterInput.js';

class FilterDropdown extends Component {
    state = {
        isOpen: false
    };

    addRemoveFilters = (selectedValue, filterName, type, isChecked) => {
        switch (type) {
            case 'checkbox':
                isChecked ? this.props.addFilter(filterName, selectedValue, type) : this.props.removeFilter(filterName, selectedValue);
                break;
            case 'radio':
                this.props.addFilter(filterName, selectedValue, type);
                break;
        }
    };

    onToggle = isOpen => {
        this.setState({
            isOpen
        });
    };

    render() {
        const { hideCategories, filters, filterCategories } = this.props;
        const { isOpen } = this.state;

        return (
            <Dropdown onSelect={ this.onSelect } toggle={ <DropdownToggle onToggle={ this.onToggle }>Filters</DropdownToggle> } isOpen={ isOpen }>
                <div>
                    { filterCategories.map(
                        (data, index) =>
                            !hideCategories.includes(data.urlParam) && (
                                <div key={ `${data.urlParam}${index}` } className="filterTitle">
                                    { data.title }
                                    { data.values.map((item, key) => (
                                        <FilterInput
                                            key={ `check${index}${key}` }
                                            aria-label={ item.label }
                                            id={ `${data.urlParam}${key}` }
                                            label={ item.label }
                                            addRemoveFilters={ this.addRemoveFilters }
                                            param={ data.urlParam }
                                            type={ data.type }
                                            value={ item.value }
                                            filters={ filters }
                                        />
                                    )) }
                                    { index !== filterCategories.length - 1 && <br /> }
                                </div>
                            )
                    ) }
                </div>
            </Dropdown>
        );
    }
}

FilterDropdown.propTypes = {
    addFilter: PropTypes.func,
    removeFilter: PropTypes.func,
    hideCategories: PropTypes.array,
    filters: PropTypes.object,
    filterCategories: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            type: PropTypes.type,
            urlParam: PropTypes.string,
            values: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string,
                    value: PropTypes.any
                })
            )
        })
    )
};

FilterDropdown.defaultProps = {
    addFilter: Function.prototype,
    removeFilter: Function.prototype,
    hideCategories: [],
    filters: {}
};

export default FilterDropdown;
