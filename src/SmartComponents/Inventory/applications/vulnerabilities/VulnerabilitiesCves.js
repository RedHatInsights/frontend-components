/* eslint-disable camelcase */
import { Stack, StackItem } from '@patternfly/react-core';
import some from 'lodash/some';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { downloadFile } from '../../../../Utilities/helpers';
import { GenericError, NoVulnerabilityData, CVSSOptions, PublicDateOptions } from './constants';
import StatusDropdown from './StatusDropdown';
import VulnerabilitiesCveTable from './VulnerabilitiesCveTable';
import VulnerabilitiesCveTableToolbar from './VulnerabilitiesCveTableToolbar';

class VulnerabilitiesCves extends Component {
    componentDidMount() {
        const { defaultSort: sort } = this.props;
        StatusDropdown.setCallback(this.sendRequest);
        this.setState({ show_all: 'true' });
        this.apply(sort && { sort });
    }

    processError = error => {
        const { status, title, detail } = error;
        const statusCode = parseInt(status);
        if (statusCode === 404 && this.props.entity) {
            return NoVulnerabilityData;
        } else {
            return GenericError;
        }
    };

    apply = (config = {}) => {
        const toBeReset = [ 'filter', 'page_size', 'show_all' ];
        if (some(toBeReset, item => config.hasOwnProperty(item) && config[item] !== this.state[item])) {
            config.page = 1;
        }

        if (config.hasOwnProperty('cvss_filter')) {
            let cvssEntry = CVSSOptions.find(item => item.value === config.cvss_filter);
            config.cvss_from = cvssEntry.from;
            config.cvss_to = cvssEntry.to;
        }

        if (config.hasOwnProperty('publish_date')) {
            let publicEntry = PublicDateOptions.find(item => item.value === config.publish_date);
            config.public_from = publicEntry.from && publicEntry.from.format('YYYY-MM-DD');
            config.public_to = publicEntry.to && publicEntry.to.format('YYYY-MM-DD');
        }

        this.setState({ ...this.state, ...config }, this.sendRequest);
    };

    selectorHandler = selectedCves => {
        this.setState({ ...this.state, selectedCves });
    };

    sendRequest = () => {
        const { fetchData } = this.props;
        //TODO: need a better way of doing this
        const showAllParam = this.state.hasOwnProperty('show_all') && !this.state.show_all;
        // eslint-disable-next-line camelcase
        fetchData && fetchData(() => this.props.fetchResource({ ...this.state, show_all: showAllParam }));
    };

    downloadReport = format => {
        const { fetchResource } = this.props;
        const { payload } = fetchResource && fetchResource({ ...this.state, page_size: Number.MAX_SAFE_INTEGER, data_format: format, page: 1 });
        payload &&
            payload.then(({ data: response }) => {
                const data = format === 'json' ? JSON.stringify(response) : response;
                return downloadFile(data, `vulnerability_cves-${new Date().toISOString()}`, format);
            });
    };

    render() {
        const { cveList, header, showAllCheckbox, dataMapper, showRemediationButton } = this.props;
        const cves = dataMapper(cveList);
        const { meta, errors } = cves;
        if (!errors) {
            return (
                <Stack>
                    <StackItem>
                        <VulnerabilitiesCveTableToolbar
                            apply={ this.apply }
                            totalNumber={ meta.total_items }
                            showAllCheckbox={ showAllCheckbox }
                            showRemediationButton={ showRemediationButton }
                            downloadReport={ this.downloadReport }
                            cves={ cves }
                            selectedCves={ this.state && this.state.selectedCves }
                            entity={ this.props.entity }
                        />
                    </StackItem>
                    <StackItem>
                        <VulnerabilitiesCveTable
                            header={ header }
                            cves={ cves }
                            selectorHandler={ this.selectorHandler }
                            isSelectable={ this.props.isSelectable }
                            apply={ this.apply }
                            entity={ this.props.entity }
                        />
                    </StackItem>
                </Stack>
            );
        } else {
            return this.processError(errors);
        }
    }
}

function mapStateToProps({ VulnerabilitiesStore }) {
    return {
        cveList: VulnerabilitiesStore && VulnerabilitiesStore.cveList
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchData: action => dispatch(action())
    };
};

VulnerabilitiesCves.propTypes = {
    cveList: propTypes.any,
    fetchData: propTypes.func,
    fetchResource: propTypes.func,
    header: propTypes.array,
    showAllCheckbox: propTypes.bool,
    showRemediationButton: propTypes.bool,
    dataMapper: propTypes.func,
    defaultSort: propTypes.any,
    entity: propTypes.any,
    isSelectable: propTypes.bool
};

VulnerabilitiesCves.defaultProps = {
    dataMapper: () => undefined,
    isSelectable: false,
    cveList: {
        isLoading: true
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VulnerabilitiesCves);
