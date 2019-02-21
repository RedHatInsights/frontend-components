import React, { Component, Fragment } from 'react';
import { Bullseye } from '@patternfly/react-core';
import { Pagination } from '../../../../PresentationalComponents/Pagination';
import routerParams from '../../../../Utilities/RouterParams';
import { SortDirection, TableVariant } from '../../../../PresentationalComponents/Table';
import findIndex from 'lodash/findIndex';
import propTypes from 'prop-types';
import { RowLoader } from '../../../../Utilities/helpers';
import { Table, TableHeader, TableBody, sortable, SortByDirection } from '@patternfly/react-table';

class VulnerabilitiesCveTable extends Component {
    handleRedirect = key => {
        const cve = key.name.title;
        if (location.href.indexOf('vulnerability') !== -1) {
            this.props.history.push('/cves/' + cve);
        } else {
            location.href = `${document.baseURI}platform/vulnerability/cves/${cve}`;
        }
    };

    changePage = page => this.props.apply({ page });

    // eslint-disable-next-line camelcase
    setPageSize = pageSize => this.props.apply({ page_size: pageSize });

    sortColumn = (event, key, direction) => {
        let columnName = this.props.header[key].key;
        const { cves } = this.props;
        const currentSort = cves.meta.sort;
        const useDefault = currentSort && currentSort.substr(1) !== columnName;
        if (direction === SortByDirection.desc || useDefault) {
            columnName = '-' + columnName;
        }

        this.props.apply({ sort: columnName });
    };

    createPagination = () => {
        const {
            cves: { meta }
        } = this.props;
        return (
            <Pagination
                page={ meta.page || 1 }
                numberOfItems={ meta.total_items || 0 }
                itemsPerPage={ meta.page_size || 50 }
                onSetPage={ page => this.changePage(page) }
                onPerPageSelect={ pageSize => this.setPageSize(pageSize) }
            />
        );
    };

    createSortBy = (value) => {
        if (value) {
            let direction = value[0] === '+' ? SortByDirection.asc : SortByDirection.desc;
            value = value.replace(/^(-|\+)/, '');
            const index = findIndex(this.props.header, item => item.key === value);
            let sort = {
                index,
                direction
            };
            return sort;
        }

        return {};
    };

    noCves = () => {
        const { cves } = this.props;
        return (
            <Bullseye>
                <b>
                    { cves.meta.filter
                        ? `None of your systems are currently exposed to any CVE matching filter " ${cves.meta.filter}"`
                        : 'You are not exposed to any CVEss.' }
                </b>
            </Bullseye>
        );
    };

    render() {
        const { cves, header } = this.props;
        const loader = [ ...Array(3) ].map(() => ({
            cells: [{
                title: <RowLoader />,
                props: {
                    colSpan: header.length - 1 }
            }]
        }));
        return (
            <Fragment>
                <Table

                    variant={ TableVariant.compact }
                    cells={ header }
                    rows={ cves.isLoading ? loader : cves.data.map(row => row.cells) }
                    sortBy={ this.createSortBy(cves.meta.sort) }
                    onSort={ this.sortColumn }
                >
                    <TableHeader />
                    <TableBody onRowClick={ (_event, key) => this.handleRedirect(key) }/>
                </Table>
                { this.createPagination() }
                { !cves.isLoading && cves.data.length === 0 && this.noCves() }
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
