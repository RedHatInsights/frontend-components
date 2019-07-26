import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { SortByDirection, Table, TableBody, TableHeader } from '@patternfly/react-table';
import { TableToolbar } from '@redhat-cloud-services/frontend-components';
import { RowLoader } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import findIndex from 'lodash/findIndex';
import propTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { EmptyCVEList, EmptyCVEListForSystem, FilterNotFoundForCVE } from './constants';
import { CVETableContext } from './VulnerabilitiesCves';

class VulnerabilitiesCveTableWithContext extends Component {
    changePage = (_event, pageNumber) => {
        const { methods } = this.props.context;
        methods.apply({ page: pageNumber });
    };

    setPageSize = (_event, perPage) => {
        const { methods } = this.props.context;
        // eslint-disable-next-line camelcase
        methods.apply({ page_size: perPage, page: 1 });
    };

    sortColumn = (event, key, direction) => {
        let columnMapping = this.props.isSelectable ? [{ key: 'checkbox' }, ...this.props.header ] : this.props.header;
        let columnName = columnMapping[key].key;
        const { cves, methods } = this.props.context;
        const currentSort = cves.meta.sort;
        const useDefault = currentSort && currentSort.substr(1) !== columnName;
        if (direction === SortByDirection.desc || useDefault) {
            columnName = '-' + columnName;
        }

        methods.apply({ sort: columnName });
    };

    createPagination = () => {
        const {
            cves: { meta }
        } = this.props.context;
        return (
            <Pagination
                page={ meta.page || 1 }
                itemCount={ meta.total_items || 0 }
                perPage={ meta.page_size || 50 }
                onSetPage={ this.changePage }
                onPerPageSelect={ this.setPageSize }
                variant={ PaginationVariant.bottom }
            />
        );
    };

    createSortBy = value => {
        if (value) {
            let columnMapping = this.props.isSelectable ? [{ key: 'checkbox' }, ...this.props.header ] : this.props.header;
            let direction = value[0] === '+' ? SortByDirection.asc : SortByDirection.desc;
            value = value.replace(/^(-|\+)/, '');
            const index = findIndex(columnMapping, item => item.key === value);
            let sort = {
                index,
                direction
            };
            return sort;
        }

        return {};
    };

    noCves = () => {
        const { entity, context } = this.props;
        const { cves } = context;
        const filterFields = [ 'filter', 'cvss_from', 'cvss_to', 'public_from', 'public_to', 'severity', 'status_id' ].filter(
            item => cves.meta.hasOwnProperty(item) && cves.meta[item]
        );
        if (filterFields.length !== 0) {
            return FilterNotFoundForCVE;
        } else if (entity) {
            return EmptyCVEListForSystem;
        } else if (cves.data.length === 0) {
            return EmptyCVEList;
        }
    };

    onSelect = (event, isSelected, rowId) => {
        const { context } = this.props;
        const { cves, methods } = context;
        const cveName = cves.data[rowId] && cves.data[rowId].id;
        methods.selectCves(isSelected, cveName);
    };

    render() {
        const { context, header } = this.props;
        const { params, cves } = context;
        const { selectedCves } = params;
        const rows = cves.data.map(cve => (selectedCves.has(cve.id) && { ...cve, selected: true }) || cve);
        const loader = [ ...Array(3) ].map(() => ({
            cells: [
                {
                    title: <RowLoader />,
                    props: {
                        colSpan: header.length
                    }
                }
            ]
        }));
        return (
            <Fragment>
                <Table
                    aria-label={ 'Vulnerability CVE table' }
                    onSelect={ (this.props.isSelectable && this.onSelect) || undefined }
                    cells={ header }
                    rows={ cves.isLoading ? loader : rows }
                    sortBy={ this.createSortBy(cves.meta.sort) }
                    onSort={ this.sortColumn }
                    gridBreakPoint={ 'grid-lg' }
                >
                    { (!cves.isLoading && cves.data.length === 0 && this.noCves()) || (
                        <Fragment>
                            <TableHeader />
                            <TableBody />
                        </Fragment>
                    ) }
                </Table>
                <TableToolbar>{ this.createPagination() }</TableToolbar>
            </Fragment>
        );
    }
}

VulnerabilitiesCveTableWithContext.propTypes = {
    context: propTypes.any,
    header: propTypes.array,
    isSelectable: propTypes.bool,
    entity: propTypes.object
};
const VulnerabilitiesCveTable = props => (
    <CVETableContext.Consumer>{ context => <VulnerabilitiesCveTableWithContext context={ context } { ...props } /> }</CVETableContext.Consumer>
);
export default VulnerabilitiesCveTable;
