import React from 'react';
import propTypes from 'prop-types';
import { FilterDropdown } from '@redhat-cloud-services/frontend-components';

class RulesComplianceFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidePassed: props.hidePassed,
            severity: props.severity,
            filterCategories: [
                {
                    type: 'radio', title: 'Passed', urlParam: 'hidePassed', values: [
                        { label: 'Show all rules', value: false },
                        { label: 'Hide passed rules', value: true }
                    ]
                },
                {
                    type: 'checkbox', title: 'Severity', urlParam: 'severity', values: [
                        { label: 'High', value: 'high' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Low', value: 'low' },
                        { label: 'Unknown', value: 'unknown' }
                    ]
                }
            ]
        };
    };

    updateInventory = () => {
        const { updateFilter } = this.props;
        const { hidePassed, severity } = this.state;
        updateFilter(hidePassed, severity);
    }

    addFilter = (filterName, selectedValue) => {
        const { hidePassed, severity } = this.state;

        if (filterName === 'hidePassed') {
            this.setState({ hidePassed: selectedValue }, this.updateInventory);
        } else if (filterName === 'severity') {
            severity.push(selectedValue);
            this.setState({ severity }, this.updateInventory);
        }
    }

    removeFilter = (filterName, selectedValue) => {
        const { hidePassed, severity } = this.state;

        if (filterName === 'hidePassed') {
            this.setState({ hidePassed: selectedValue }, this.updateInventory);
        } else if (filterName === 'severity') {
            this.setState({ severity: severity.filter((value) => value !== selectedValue) }, this.updateInventory);
        }
    }

    render() {
        return (
            <FilterDropdown
                filters = { this.state }
                addFilter={ this.addFilter }
                removeFilter={ this.removeFilter }
                filterCategories={ this.state.filterCategories }
            />
        );
    }
}

RulesComplianceFilter.propTypes = {
    updateFilter: propTypes.function,
    hidePassed: propTypes.array,
    severity: propTypes.array,
    availablePolicies: propTypes.array
};

RulesComplianceFilter.defaultProps = {
    hidePassed: false,
    severity: []
};

export default RulesComplianceFilter;
