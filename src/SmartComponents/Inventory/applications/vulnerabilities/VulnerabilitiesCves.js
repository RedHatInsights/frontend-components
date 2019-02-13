import React, { Component } from 'react';
import { Stack, StackItem } from '@patternfly/react-core';
import some from 'lodash/some';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import VulnerabilitiesCveTable from './VulnerabilitiesCveTable';
import VulnerabilitiesCveTableToolbar from './VulnerabilitiesCveTableToolbar';
import { downloadFile } from '../../../../Utilities/helpers';

class VulnerabilitiesCves extends Component {
    componentDidMount() {
        const { defaultSort: sort } = this.props;
        this.apply(sort && { sort });
    }

    apply = (config = {}) => {
        const toBeReset = [ 'filter', 'page_size', 'show_all' ];
        if (some(toBeReset.map(item => config.hasOwnProperty(item)), item => item === true)) {
            config.page = 1;
        }

        this.setState({ ...this.state, ...config }, this.sendRequest);
    }

    sendRequest = () => {
        const { fetchData } = this.props;
        fetchData && fetchData(() => this.props.fetchResource(this.state));
    }

    downloadReport = (event, format) => {
        const { fetchResource } = this.props;
        const { payload } = fetchResource &&
            // eslint-disable-next-line camelcase
            fetchResource({ ...this.state, page_size: Number.MAX_SAFE_INTEGER, data_format: format, page: 1 });
        payload && payload.then(({ data: response }) => {
            const data = format === 'json' ? JSON.stringify(response) : response;
            return downloadFile(data, undefined, format);
        }
        );
    }

    render() {
        const { cveList, header, showAllCheckbox, dataMapper, showRemediationButton } = this.props;
        const cves = dataMapper(cveList);
        return (
            <Stack>
                <StackItem>
                    <VulnerabilitiesCveTableToolbar
                        apply={ this.apply }
                        totalNumber={ cves.meta.total_items }
                        showAllCheckbox={ showAllCheckbox }
                        showRemediationButton={ showRemediationButton }
                        downloadReport={ this.downloadReport }
                        cves={ cves }
                        entity={ this.props.entity }
                    />
                </StackItem>
                <StackItem>
                    <VulnerabilitiesCveTable
                        header={ header }
                        cves={ cves }
                        apply={ this.apply }
                    />
                </StackItem>
            </Stack>
        );
    }
}

function mapStateToProps({ VulnerabilitiesStore }) {
    return {
        cveList: VulnerabilitiesStore && VulnerabilitiesStore.cveList
    };
}

const mapDispatchToProps = (dispatch) => {
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
    entity: propTypes.any
};

VulnerabilitiesCves.defaultProps = {
    dataMapper: () => undefined,
    cveList: {
        isLoading: true
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VulnerabilitiesCves);
