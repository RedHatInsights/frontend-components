import React, { Component, Fragment } from 'react';
import { Bullseye } from '@patternfly/react-core';
import { Pagination } from '../../../../PresentationalComponents/Pagination';
import routerParams from '../../../../Utilities/RouterParams';
import { SortDirection, Table } from '../../../../PresentationalComponents/Table';
import findIndex from 'lodash/findIndex';
import propTypes from 'prop-types';
import { RowLoader } from '../../../../Utilities/helpers';

class VulnerabilitiesCveTable extends Component {
    handleRedirect = (key) => {
        if (location.href.indexOf('vulnerability') !== -1) {
            this.props.history.push('/cves/' + key);
        } else {
            location.href = `${document.baseURI}platform/vulnerability/cves/${key}`;
        }
    }

    changePage = (page) => this.props.apply({ page });

    // eslint-disable-next-line camelcase
    setPageSize = (pageSize) => this.props.apply({ page_size: pageSize });

    sortColumn = (key, direction) => {
        let columnName = this.props.header[key].key;
        if (direction === SortDirection.down) {
            columnName = '-' + columnName;
        }

        this.props.apply({ sort: columnName });
    }

    createPagination = () => {
        const { cves: { meta }} = this.props;
        return (
            <Pagination
                page={ meta.page || 1 }
                numberOfItems={ meta.total_items || 0 }
                itemsPerPage={ meta.page_size || 50 }
                onSetPage={ page => this.changePage(page) }
                onPerPageSelect={ pageSize => this.setPageSize(pageSize) }
            />
        );
    }

    createSortBy = (value) => {
        if (value) {
            let direction = value[0] === '+' ? SortDirection.up : SortDirection.down;
            value = value.replace(/^(-|\+)/, '');
            const index = findIndex(this.props.header, item => item.key === value).toString();
            let sort = {
                index,
                direction
            };
            return sort;
        }

        return {};
    }

    noCves = () => {
        const { cves } = this.props;
        return (
            <Bullseye>
                <b>
                    {
                        cves.meta.filter ?
                            `None of your systems are currently exposed to any CVE matching filter " ${cves.meta.filter}"` :
                            'You are not exposed to any CVEs.'
                    }
                </b>
            </Bullseye>
        );
    }

    render() {
        const { cves, header } = this.props;
        return (
            <Fragment>
                { this.createPagination() }
                <Table
                    header={ header }
                    rows={ cves.isLoading ? [ ...Array(3) ].map(() => ({
                        cells: [{
                            title: <RowLoader />,
                            colSpan: header.length
                        }]
                    })) : cves.data }
                    onRowClick={ (_event, key) => this.handleRedirect(key) }
                    sortBy={ this.createSortBy(cves.meta.sort) }
                    onSort={ (_event, colKey, direction) => this.sortColumn(colKey, direction) }
                />
                {
                    !cves.isLoading &&
                    cves.data.length === 0 &&
                    this.noCves()
                }
            </Fragment>
        );
    }
}

VulnerabilitiesCveTable.propTypes = {
    cves: propTypes.any,
    header: propTypes.array,
    history: propTypes.object,
    apply: propTypes.func
};
export default routerParams(VulnerabilitiesCveTable);
