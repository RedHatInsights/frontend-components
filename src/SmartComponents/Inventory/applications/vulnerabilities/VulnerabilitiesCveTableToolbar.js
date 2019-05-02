/* eslint-disable camelcase */
import { Dropdown, DropdownItem, KebabToggle, Pagination, ToolbarGroup } from '@patternfly/react-core';
import debounce from 'lodash/debounce';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FilterDropdown } from '../../../../PresentationalComponents/Filters/';
import { SimpleTableFilter } from '../../../../PresentationalComponents/SimpleTableFilter';
import { TableToolbar } from '../../../../PresentationalComponents/TableToolbar';
import { fetchSystemCveStatusList } from '../../../../redux/actions/applications';
import routerParams from '../../../../Utilities/RouterParams';
import { addNotification } from '../../../Notifications';
import RemediationButton from '../../../Remediations/RemediationButton';
import { filtersCVSSScore, filtersPublishDate, filtersSeverity, filtersShowAll } from './constants';

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

        this.setState({ ...this.state, ...newFilter, page: 1 }, this.apply);
    };

    removeFilter = (key, value) => {
        const newFilter = {
            [key]: this.state[key]
            .split(',')
            .filter(item => item !== value)
            .join(',')
        };

        if (newFilter.length !== 0) {
            this.setState({ ...this.state, ...newFilter, page: 1 }, this.apply);
        } else {
            const filter = { ...this.state, [key]: undefined };
            this.setState({ ...this.state, ...filter, page: 1 }, this.apply);
        }
    };

    changePage = (_event, pageNumber) => this.setState({ ...this.state, page: pageNumber }, this.apply);

    setPageSize = (_event, perPage) => this.setState({ ...this.state, page_size: perPage, page: 1 }, this.apply);

    apply = () => this.props.apply(this.state);

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
            <TableToolbar className="space-between-toolbar-items">
                <ToolbarGroup className="vulnerability-toolbar-spacing">
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
                    { showRemediationButton && (
                        <div>
                            <RemediationButton
                                dataProvider={ this.remediationProvider }
                                isDisabled={ this.remediationProvider() === false }
                                onRemediationCreated={ result => this.props.addNotification(result.getNotification()) }
                            />
                        </div>
                    ) }
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

                <ToolbarGroup>
                    <Pagination
                        page={ cves.meta.page || 1 }
                        itemCount={ cves.meta.total_items || 0 }
                        perPage={ cves.meta.page_size || 50 }
                        onSetPage={ this.changePage }
                        onPerPageSelect={ this.setPageSize }
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
