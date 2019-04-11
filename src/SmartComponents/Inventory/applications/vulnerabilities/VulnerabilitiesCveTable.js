import { SortByDirection, Table, TableBody, TableHeader } from '@patternfly/react-table';
import findIndex from 'lodash/findIndex';
import propTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Pagination } from '../../../../PresentationalComponents/Pagination';
import { TableToolbar } from '../../../../PresentationalComponents/TableToolbar';
import { RowLoader } from '../../../../Utilities/helpers';
import routerParams from '../../../../Utilities/RouterParams';
import { EmptyCVEList, EmptyCVEListForSystem, FilterNotFoundForCVE } from './constants';

class VulnerabilitiesCveTable extends Component {
    state = { selectedCves: new Set() };

    changePage = page => this.props.apply({ page });

    // eslint-disable-next-line camelcase
    setPageSize = pageSize => this.props.apply({ page_size: pageSize });

    sortColumn = (event, key, direction) => {
        let columnMapping = this.props.isSelectable ? [{ key: 'checkbox' }, ...this.props.header ] : this.props.header;
        let columnName = columnMapping[key].key;
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
        const { cves, entity } = this.props;

        if (cves.meta.filter) {
            return FilterNotFoundForCVE;
        } else if (entity) {
            return EmptyCVEListForSystem;
        } else if (cves.data.length === 0) {
            return EmptyCVEList;
        }
    };

    onSelect = (event, isSelected, rowId) => {
        const { cves } = this.props;
        const { selectedCves } = this.state;
        if (rowId === -1) {
            isSelected ? cves.data.forEach(cve => selectedCves.add(cve.id)) : cves.data.forEach(cve => selectedCves.delete(cve.id));
        } else {
            const cveName = cves.data[rowId] && cves.data[rowId].id;
            isSelected ? selectedCves.add(cveName) : selectedCves.delete(cveName);
        }

        this.setState(selectedCves, () => this.props.selectorHandler(selectedCves));
    };

    render() {
        const { cves, header } = this.props;
        const { selectedCves } = this.state;
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
                >
                    { (!cves.isLoading && cves.data.length === 0 && this.noCves()) || (
                        <div>
                            <TableHeader />
                            <TableBody />
                            <TableToolbar isFooter>{ this.createPagination() }</TableToolbar>
                        </div>
                    ) }
                </Table>
            </Fragment>
        );
    }
}

VulnerabilitiesCveTable.propTypes = {
    cves: propTypes.any,
    header: propTypes.array,
    history: propTypes.object,
    apply: propTypes.func,
    selectorHandler: propTypes.func,
    isSelectable: propTypes.bool,
    entity: propTypes.object
};
export default routerParams(VulnerabilitiesCveTable);
