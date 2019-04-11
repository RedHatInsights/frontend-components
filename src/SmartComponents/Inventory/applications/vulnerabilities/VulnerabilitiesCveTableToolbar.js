/* eslint-disable camelcase */
import { Dropdown, DropdownItem, KebabToggle, ToolbarGroup } from '@patternfly/react-core';
import debounce from 'lodash/debounce';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FilterDropdown } from '../../../../PresentationalComponents/Filters/';
import { Pagination } from '../../../../PresentationalComponents/Pagination';
import { SimpleTableFilter } from '../../../../PresentationalComponents/SimpleTableFilter';
import { TableToolbar } from '../../../../PresentationalComponents/TableToolbar';
import routerParams from '../../../../Utilities/RouterParams';
import { addNotification } from '../../../Notifications';
import RemediationButton from '../../../Remediations/RemediationButton';
import { filtersCVSSScore, filtersPublishDate, filtersSeverity, filtersShowAll } from './constants';
import { fetchSystemCveStatusList } from '../../../../redux/actions/applications';

class VulnerabilitiesCveTableToolbar extends Component {
    state = { isKebabOpen: false, show_all: 'true', publish_date: 'all', cvss_filter: 'all' };

    componentDidMount() {
        this.props.entity && this.props.fetchStatusList();
    }
    changeFilterValue = debounce(
        value =>
            this.setState(
                {
                    ...this.state,
                    filter: value
                },
                this.apply
            ),
        400
    );

    onKebabToggle = isKebabOpen => {
        this.setState({
            isKebabOpen
        });
    };

    onKebabSelect = event => {
        this.setState({
            isKebabOpen: !this.state.isKebabOpen
        });
    };

    addFilter = (param, value, type) => {
        let newFilter;
        if (type === 'radio' || param === 'show_all') {
            newFilter = { [param]: value };
        } else {
            newFilter = this.state[param] ? { [param]: `${this.state[param]},${value}` } : { [param]: value };
        }

        this.setState({ ...this.state, ...newFilter }, this.apply);
    };

    removeFilter = (key, value) => {
        const newFilter = {
            [key]: this.state[key]
            .split(',')
            .filter(item => item !== value)
            .join(',')
        };

        if (newFilter.length !== 0) {
            this.setState({ ...this.state, ...newFilter }, this.apply);
        } else {
            const filter = { ...this.state, [key]: undefined };
            this.setState({ ...this.state, ...filter }, this.apply);
        }
    };

    changePage = page => this.setState({ ...this.state, page }, this.apply);

    setPageSize = pageSize => this.setState({ ...this.state, page_size: pageSize }, this.apply);

    apply = () => this.props.apply(this.state);

    changeCVSSValue = (value, options) => {
        const target = options.find(item => item.value === value);
        this.setState({ ...this.state, cvss_from: target.from, cvss_to: target.to }, this.apply);
    };

    changeCheckboxValue = value => {
        this.setState({ ...this.state, show_all: !value }, this.apply);
    };

    getCVSSValue = options => {
        const option = options.find(item => item.from === this.state.cvss_from && item.to === this.state.cvss_to);
        return option ? option.value : options[0].value;
    };

    remediationProvider = () => {
        if (!this.props.selectedCves || this.props.selectedCves.size === 0) {
            return false;
        }

        return {
            issues: [ ...this.props.selectedCves ].map(cve => ({ id: `vulnerabilities:${cve}`, description: cve })),
            systems: [ this.props.entity.id ]
        };
    };

    render() {
        const { showAllCheckbox, downloadReport, totalNumber, showRemediationButton, cves, entity, statusList } = this.props;
        const filtersStatusList = entity &&
            statusList &&
            statusList.payload && {
            type: 'checkbox',
            title: 'Status',
            urlParam: 'status_id',
            values: statusList.payload.data.map(item => ({ label: item.name, value: String(item.id) }))
        };
        const selectedCvesCount =
            this.props.showRemediationButton === true ? (this.props.selectedCves && this.props.selectedCves.size) || 0 : undefined;
        return (
            <TableToolbar className="pf-u-justify-content-space-between" results={ totalNumber } selected={ selectedCvesCount }>
                <ToolbarGroup className="space-between-toolbar-items">
                    <div>
                        <SimpleTableFilter onFilterChange={ value => this.changeFilterValue(value) } buttonTitle={ null } placeholder="Find a CVE…" />
                    </div>
                    <div>
                        <FilterDropdown
                            addFilter={ this.addFilter }
                            removeFilter={ this.removeFilter }
                            filters={ this.state }
                            filterCategories={ [
                                showAllCheckbox && filtersShowAll,
                                filtersCVSSScore,
                                filtersSeverity,
                                filtersPublishDate,
                                entity && filtersStatusList
                            ].filter(Boolean) }
                        />
                    </div>
                    <div>
                        <Dropdown
                            onSelect={ this.onKebabSelect }
                            toggle={ <KebabToggle onToggle={ this.onKebabToggle } /> }
                            isOpen={ this.state.isKebabOpen }
                            isPlain
                            dropdownItems={ [
                                <DropdownItem key="json" component="button" onClick={ () => downloadReport('json') }>
                                    Export as JSON
                                </DropdownItem>,
                                <DropdownItem key="csv" component="button" onClick={ () => downloadReport('csv') }>
                                    Export as CSV
                                </DropdownItem>
                            ] }
                        />
                    </div>
                </ToolbarGroup>
                { showRemediationButton && (
                    <ToolbarGroup>
                        <RemediationButton
                            dataProvider={ this.remediationProvider }
                            isDisabled={ this.remediationProvider() === false }
                            onRemediationCreated={ result => this.props.addNotification(result.getNotification()) }
                        />
                    </ToolbarGroup>
                ) }
                <ToolbarGroup>
                    <Pagination
                        page={ cves.meta.page || 1 }
                        numberOfItems={ cves.meta.total_items || 0 }
                        itemsPerPage={ cves.meta.page_size || 50 }
                        onSetPage={ page => this.changePage(page) }
                        onPerPageSelect={ pageSize => this.setPageSize(pageSize) }
                    />
                </ToolbarGroup>
            </TableToolbar>
        );
    }
}

VulnerabilitiesCveTableToolbar.propTypes = {
    CVETable: propTypes.any,
    apply: propTypes.func,
    showAllCheckbox: propTypes.bool,
    showRemediationButton: propTypes.bool,
    totalNumber: propTypes.number,
    downloadReport: propTypes.func,
    cves: propTypes.any,
    entity: propTypes.object,
    addNotification: propTypes.func.isRequired,
    selectedCves: propTypes.any,
    fetchStatusList: propTypes.func,
    statusList: propTypes.object
};

VulnerabilitiesCveTableToolbar.defaultProps = {
    showAllCheckbox: false,
    showRemediationButton: false,
    totalNumber: 0,
    apply: () => undefined,
    downloadReport: () => undefined
};

export default connect(
    ({ VulnerabilitiesStore }) => ({
        statusList: VulnerabilitiesStore && VulnerabilitiesStore.statusList
    }),
    dispatch => ({
        addNotification: notification => dispatch(addNotification(notification)),
        fetchStatusList: () => dispatch(fetchSystemCveStatusList())
    })
)(routerParams(VulnerabilitiesCveTableToolbar));
