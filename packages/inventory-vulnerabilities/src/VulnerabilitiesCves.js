/* eslint-disable camelcase */
import { Stack, StackItem } from '@patternfly/react-core';
import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CVSSOptions, GenericError, NoVulnerabilityData, PublicDateOptions } from './constants';
import StatusDropdown from './StatusDropdown';
import VulnerabilitiesCveTable from './VulnerabilitiesCveTable';
import VulnerabilitiesCveTableToolbar from './VulnerabilitiesCveTableToolbar';

export const CVETableContext = React.createContext({});

class VulnerabilitiesCves extends Component {
    state = { selectedCves: new Set() };

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
        if (config.hasOwnProperty('cvss_filter')) {
            let cvssEntry = CVSSOptions.find(item => item.value === config.cvss_filter);
            if (!cvssEntry) {
                let values = config.cvss_filter.split(/[^0-9]+/).filter(item => parseFloat(item));
                cvssEntry = { value: config.cvss_filter, from: values[0], to: values[1] };
            }

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

    selectCves = (isSelected, cveNames) => {
        let { selectedCves } = this.state;
        if (cveNames) {
            [].concat(cveNames).forEach(cveName => {
                isSelected ? selectedCves.add(cveName) : selectedCves.delete(cveName);
            });
        } else {
            selectedCves = new Set();
        }

        this.setState({ ...this.state, selectedCves: new Set(selectedCves) });
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
        const params = { ...this.state, show_all: !this.state.show_all };
        let { payload } = fetchResource && fetchResource({ ...params, page_size: Number.MAX_SAFE_INTEGER, data_format: format, page: 1 });
        payload &&
            payload.then(({ data: response }) => {
                const data = format === 'json' ? JSON.stringify(response) : response;
                return downloadFile(data, `vulnerability_cves-${new Date().toISOString()}`, format);
            });
    };

    render() {
        const { cveList, header, showAllCheckbox, dataMapper, showRemediationButton, fetchResource } = this.props;
        const { apply, downloadReport, selectCves } = this;
        const cves = dataMapper(cveList);
        const { meta, errors } = cves;
        if (!errors) {
            return (
                <CVETableContext.Provider value={ { cves, params: this.state, methods: { apply, downloadReport, selectCves, fetchResource }} }>
                    <Stack>
                        <StackItem>
                            <VulnerabilitiesCveTableToolbar
                                showAllCheckbox={ showAllCheckbox }
                                showRemediationButton={ showRemediationButton }
                                entity={ this.props.entity }
                            />
                        </StackItem>
                        <StackItem>
                            <VulnerabilitiesCveTable header={ header } isSelectable={ this.props.isSelectable } entity={ this.props.entity } />
                        </StackItem>
                    </Stack>
                </CVETableContext.Provider>
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
