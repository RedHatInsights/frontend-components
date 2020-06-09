import React from 'react';
import PropTypes from 'prop-types';
import { selectEntity, setSort } from '../../redux/actions';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
    Table as PfTable,
    TableBody,
    TableHeader,
    TableGridBreakpoint,
    cellWidth,
    TableVariant,
    sortable,
    expandable
} from '@patternfly/react-table';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/components/esm/SkeletonTable';
import NoSystemsTable from './NoSystemsTable';

class EntityTable extends React.Component {
    onItemSelect = (_event, checked, rowId) => {
        const { rows, expandable: isExpandable } = this.props;
        const row = isExpandable ? rows[rowId / 2] : rows[rowId];
        this.props.selectEntity && this.props.selectEntity(rowId === -1 ? 0 : row.id, checked);
    }

    onSort = (_event, key, direction, index) => {
        if (key !== 'action' && key !== 'health') {
            this.props.setSort && this.props.setSort(key, direction);
        }

        this.props.onSort && this.props.onSort({
            index,
            key,
            direction
        });
    }

    buildCells = (item) => {
        return this.props.columns
        .map(({ key, renderFunc }) => {
            const data = get(item, key, ' ');
            return renderFunc ? {
                title: renderFunc(data, item.id, item, this.props)
            } : data;
        })
        .filter(cell => cell !== false && cell !== undefined);
    }

    createRows = () => {
        const { rows, columns, actions, expandable } = this.props;

        if (rows.length === 0) {
            return [{
                cells: [{
                    title: <NoSystemsTable />,
                    props: {
                        colSpan: columns.length + Boolean(actions)
                    }
                }]
            }];
        }

        return rows.map((oneItem, key) => ([{
            ...oneItem,
            ...oneItem.children && expandable && { isOpen: !!oneItem.isOpen },
            cells: this.buildCells(oneItem)
        }, oneItem.children && expandable && {
            cells: [
                {
                    title: typeof oneItem.children === 'function' ? oneItem.children() : oneItem.children
                }
            ],
            parent: key * 2,
            fullWidth: true
        } ])).flat().filter(Boolean);
    }

    createColumns = () => {
        const { columns, hasItems, rows, expandable: isExpandable } = this.props;
        return columns.map(({ props, transforms, ...oneCell }) => ({
            ...oneCell,
            transforms: [
                ...transforms || [],
                ...props && props.width ? [ cellWidth(props.width) ] : [],
                ...hasItems || rows.length <= 0 || (props && props.isStatic) ? [] : [ sortable ]
            ],
            cellFormatters: [
                ...isExpandable ? [ expandable ] : []
            ]
        }));
    }

    render() {
        const {
            rows,
            columns,
            loaded,
            expandable,
            onExpandClick,
            hasCheckbox,
            actions,
            variant,
            sortBy,
            tableProps,
            showTags
        } = this.props;
        const cells = loaded && this.createColumns();
        console.log(actions, 'fff');

        return (
            <React.Fragment>
                { loaded ?
                    PfTable && <PfTable
                        variant={ variant }
                        aria-label="Host inventory"
                        cells={ cells }
                        rows={ this.createRows() }
                        gridBreakPoint={ columns.length > 5 ? TableGridBreakpoint.gridLg : TableGridBreakpoint.gridMd }
                        className="ins-c-entity-table"
                        onSort={ (event, index, direction) => {
                            this.onSort(event, cells[index - Boolean(hasCheckbox) - Boolean(expandable)].key, direction, index);
                        } }
                        sortBy={ {
                            index: cells.findIndex(item => sortBy && sortBy.key === item.key) + Boolean(hasCheckbox) + Boolean(expandable),
                            direction: sortBy && sortBy.direction
                        } }
                        { ...{
                            ...hasCheckbox && rows.length !== 0 ? { onSelect: this.onItemSelect } : {},
                            ...expandable ? { onCollapse: onExpandClick } : {},
                            ...actions && rows.length > 0 && { actions }
                        } }
                        { ...tableProps }
                    >
                        <TableHeader />
                        <TableBody />
                    </PfTable> :
                    <SkeletonTable colSize={ columns.length } rowSize={ 15 } />
                }
            </React.Fragment>
        );
    }
}

EntityTable.propTypes = {
    variant: PropTypes.oneOf(Object.values(TableVariant || {})),
    expandable: PropTypes.bool,
    onExpandClick: PropTypes.func,
    setSort: PropTypes.func,
    hasCheckbox: PropTypes.bool,
    showActions: PropTypes.bool,
    hasItems: PropTypes.bool,
    rows: PropTypes.arrayOf(PropTypes.any),
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        composed: PropTypes.arrayOf(PropTypes.string)
    })),
    showHealth: PropTypes.bool,
    loaded: PropTypes.bool,
    items: PropTypes.array,
    sortBy: PropTypes.shape({
        key: PropTypes.string,
        direction: PropTypes.oneOf([ 'asc', 'desc' ])
    }),
    tableProps: PropTypes.shape({
        [PropTypes.string]: PropTypes.any
    }),
    selectEntity: PropTypes.func,
    onRowClick: PropTypes.func,
    onToggleTagModal: PropTypes.func,
    showTags: PropTypes.bool
};

EntityTable.defaultProps = {
    loaded: false,
    showHealth: false,
    expandable: false,
    hasCheckbox: true,
    showActions: false,
    columns: [],
    rows: [],
    onExpandClick: () => undefined,
    selectEntity: () => undefined,
    onToggleTagModal: () => undefined,
    tableProps: {}
};

function mapDispatchToProps(dispatch) {
    return {
        selectEntity: (id, isSelected) => dispatch(selectEntity(id, isSelected)),
        setSort: (id, sortDirection) => dispatch(setSort(id, sortDirection))
    };
}

function mapStateToProps({ entities: { columns, rows, loaded } }, { hasItems, isLoaded }) {
    return {
        columns,
        loaded: hasItems && isLoaded !== undefined ? (isLoaded && loaded) : loaded,
        rows
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityTable);
