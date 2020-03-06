import React from 'react';
import propTypes from 'prop-types';
import { FilterDropdown } from '@redhat-cloud-services/frontend-components';
import { FilterIcon } from '@patternfly/react-icons';
import { HIGH_SEVERITY, MEDIUM_SEVERITY, LOW_SEVERITY } from './Constants';

class RulesComplianceFilter extends React.Component {
    constructor(props) {
        super(props);
        const filterCategories = [];
        if (props.showPassFailFilter) {
            filterCategories.push({
                type: 'radio', title: 'Passed', urlParam: 'hidePassed', values: [
                    { label: 'Show all rules', value: false },
                    { label: 'Hide passed rules', value: true }
                ]
            });
        }

        if (props.selectedFilter) {
            filterCategories.push({
                type: 'radio', title: 'Selected', urlParam: 'selected', values: [
                    { label: 'Show selected rules', value: true },
                    { label: 'Show all rules', value: false }
                ]
            });
        }

        filterCategories.push({
            type: 'checkbox', title: 'Severity', urlParam: 'severity', values: [
                { label: HIGH_SEVERITY, value: 'high' },
                { label: MEDIUM_SEVERITY, value: 'medium' },
                { label: LOW_SEVERITY, value: 'low' },
                { label: 'Unknown', value: 'unknown' }
            ]
        });

        if (props.availablePolicies && props.availablePolicies.length > 1) {
            filterCategories.push({
                type: 'checkbox', title: 'Policy', urlParam: 'policy',
                values: props.availablePolicies.map(policy => ({
                    label: policy.name, value: policy.name
                }))
            });
        }

        this.state = {
            hidePassed: props.hidePassed,
            selected: props.selected,
            severity: props.severity,
            policy: props.policy,
            filterCategories
        };
    };

    updateInventory = () => {
        const { updateFilter } = this.props;
        const { hidePassed, severity, policy, selected } = this.state;
        updateFilter(hidePassed, severity, policy, selected);
    }

    addFilter = (filterName, selectedValue) => {
        const { severity, policy } = this.state;

        if (filterName === 'hidePassed') {
            this.setState({ hidePassed: selectedValue }, this.updateInventory);
        } else if (filterName === 'severity') {
            this.setState({ severity: [ ...severity, selectedValue ] }, this.updateInventory);
        } else if (filterName === 'policy') {
            this.setState({ policy: [ ...policy, selectedValue ] }, this.updateInventory);
        } else if (filterName === 'selected') {
            this.setState({ selected: selectedValue }, this.updateInventory);
        }
    }

    removeFilter = (filterName, selectedValue) => {
        const { policy, severity } = this.state;

        if (filterName === 'hidePassed') {
            this.setState({ hidePassed: selectedValue }, this.updateInventory);
        } else if (filterName === 'severity') {
            this.setState({ severity: severity.filter((value) => value !== selectedValue) }, this.updateInventory);
        } else if (filterName === 'policy') {
            this.setState({ policy: policy.filter((value) => value !== selectedValue) }, this.updateInventory);
        } else if (filterName === 'selected') {
            this.setState({ selected: selectedValue }, this.updateInventory);
        }
    }

    render() {
        return (
            <FilterDropdown
                id='rules-compliance-filter'
                label={<FilterIcon/>}
                filters = { this.state }
                addFilter={ this.addFilter }
                removeFilter={ this.removeFilter }
                filterCategories={ this.state.filterCategories }
            />
        );
    }
}

RulesComplianceFilter.propTypes = {
    updateFilter: propTypes.func,
    hidePassed: propTypes.bool,
    showPassFailFilter: propTypes.bool,
    selectedFilter: propTypes.bool,
    selected: propTypes.bool,
    severity: propTypes.array,
    availablePolicies: propTypes.array,
    policy: propTypes.array
};

RulesComplianceFilter.defaultProps = {
    hidePassed: false,
    showPassFailFilter: true,
    selectedFilter: false,
    severity: [],
    policy: [],
    selected: true,
    updateFilter: () => {}
};

export default RulesComplianceFilter;
