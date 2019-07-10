/* eslint-disable camelcase */

import { FilterDropdown, SimpleTableFilter } from '@redhat-cloud-services/frontend-components';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import * as _ from 'lodash';
import debounce from 'lodash/debounce';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filtersCVSSScore, filtersPublishDate, filtersSeverity, filtersShowAll } from '../constants';
import { fetchSystemCveStatusList } from '../redux/actions';

class Filters extends Component {
    state = { show_all: 'true', publish_date: 'all', cvss_filter: 'all' };

    difference(object, base) {
        function changes(object, base) {
            return _.transform(object, function(result, value, key) {
                if (!_.isEqual(value, base[key])) {
                    result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
                }
            });
        }

        return changes(object, base);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }

        return true;
    }

    componentDidMount() {
        this.props.showStatusList && this.props.fetchStatusList();
        const urlParams = new URLSearchParams(this.props.location.search);
        const cvss_filter = urlParams.get('cvss_filter');
        cvss_filter && this.setState({ ...this.state, cvss_filter }, this.apply);
        cvss_filter && history.pushState(null, null, window.location.href.split('?')[0]);
    }

    apply = () => {
        this.props.apply(this.state);
    };

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
                        filters={ this.state }
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
