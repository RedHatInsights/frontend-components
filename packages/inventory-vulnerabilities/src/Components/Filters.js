/* eslint-disable camelcase */

import { FilterDropdown, SimpleTableFilter } from '@redhat-cloud-services/frontend-components';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import debounce from 'lodash/debounce';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filtersCVSSScore, filtersPublishDate, filtersSeverity, filtersShowAll } from '../constants';
import { fetchSystemCveStatusList } from '../redux/actions';

class Filters extends Component {
    componentDidMount() {
        this.props.showStatusList && this.props.fetchStatusList();
        const urlParams = new URLSearchParams(this.props.location.search);
        const cvss_filter = urlParams.get('cvss_filter');
        cvss_filter && this.props.apply({ cvss_filter });
        cvss_filter && history.pushState(null, null, window.location.href.split('?')[0]);
    }

    changeFilterValue = debounce(
        value =>
            this.props.apply({
                filter: value,
                page: 1
            }),
        400
    );

    addFilter = (param, value, type) => {
        const { filterValues, apply } = this.props;
        let newFilter;
        if (type === 'radio' || param === 'show_all') {
            newFilter = { [param]: value };
        } else {
            newFilter = filterValues[param] ? { [param]: `${filterValues[param]},${value}` } : { [param]: value };
        }

        apply({ ...newFilter, page: 1 });
    };

    removeFilter = (key, value) => {
        const { filterValues, apply } = this.props;
        const values = value.split(',');
        const newFilter = {
            [key]: filterValues[key]
            .split(',')
            .filter(item => !values.includes(item))
            .join(',')
        };

        if (newFilter.length !== 0) {
            apply({ ...newFilter, page: 1 });
        } else {
            const filter = { ...filterValues, [key]: undefined };
            apply({ ...filter, page: 1 });
        }
    };

    render() {
        const { showAllCheckbox, showStatusList, statusList } = this.props;
        const filtersStatusList = showStatusList &&
            statusList &&
            statusList.payload && {
            type: 'checkbox',
            title: 'Status',
            urlParam: 'status_id',
            values: statusList.payload.data.map(item => ({ label: item.name, value: String(item.id) }))
        };
        return (
            <React.Fragment>
                <div>
                    <SimpleTableFilter onFilterChange={ value => this.changeFilterValue(value) } buttonTitle={ null } placeholder="Find a CVE…" />
                </div>
                <div>
                    <FilterDropdown
                        addFilter={ this.addFilter }
                        removeFilter={ this.removeFilter }
                        filters={ this.props.filterValues }
                        filterCategories={ [
                            showAllCheckbox && filtersShowAll,
                            filtersCVSSScore,
                            filtersSeverity,
                            filtersPublishDate,
                            showStatusList && filtersStatusList
                        ].filter(Boolean) }
                    />
                </div>
            </React.Fragment>
        );
    }
}

Filters.propTypes = {
    filterValues: propTypes.object,
    showAllCheckbox: propTypes.bool,
    showStatusList: propTypes.bool,
    statusList: propTypes.object,
    apply: propTypes.func,
    location: propTypes.object,
    fetchStatusList: propTypes.func
};

export default connect(
    ({ VulnerabilitiesStore }) => ({
        statusList: VulnerabilitiesStore && VulnerabilitiesStore.statusList
    }),
    dispatch => ({
        fetchStatusList: () => dispatch(fetchSystemCveStatusList())
    })
)(routerParams(Filters));
