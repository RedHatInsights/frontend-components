import React from 'react';
import PropTypes from 'prop-types';
import routerParams from '../../Utilities/RouterParams';
import { selectEntity, setSort, detailSelect } from '../../redux/actions/inventory';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Table as PfTable, TableBody, TableHeader, TableGridBreakpoint, cellWidth, TableVariant } from '@patternfly/react-table';
import { SkeletonTable } from '../../PresentationalComponents/SkeletonTable';
import { EmptyTable } from '../../PresentationalComponents/EmptyTable';

class EntityTable extends React.Component {
    onRowClick = (_event, key, application) => {
        const { match: { url }, history, onDetailSelect, loaded } = this.props;
        if (loaded) {
            const dilimeter = url.substr(-1, 1) === '/' ? '' : '/';
            history.push(`${url}${dilimeter}${key}/${application ? application : ''}`);
            onDetailSelect && onDetailSelect(application);
        }
    }

    onItemSelect = (_event, checked, rowId) => {
        const { rows } = this.props;
        this.props.selectEntity && this.props.selectEntity(rowId === -1 ? 0 : rows[rowId].id, checked);
    }

    onSort = (_event, key, direction) => {
        if (key !== 'action' && key !== 'health') {
            this.props.setSort && this.props.setSort(key, direction);
        }
    }

    renderCol = (col, key, composed, isTime) => {
        if (!col.hasOwnProperty('isOpen')) {
            if (composed) {
                return (
                    <div className="ins-composed-col">
                        { composed.map(path => (
                            <div key={ path }
                                widget="col"
                                data-key={ path }
                                onClick={ event => this.onRowClick(event, col.id) }
                            >
                                { get(col, path, ' ') || '\u00A0' }
                            </div>
                        )) }
                    </div>
                );
            }

            if (isTime) {
                return (new Date(get(col, key, ' '))).toLocaleString();
            }
        }

        return get(col, key, ' ');
    }

    buildCells = (item) => {
        const { columns } = this.props;
        if (item.hasOwnProperty('isOpen')) {
            return [{
                title: item.title
            }];
        }

        return [
            ...columns.map(({ key, composed, isTime }) => this.renderCol(item, key, composed, isTime))
        ].filter(cell => cell !== false && cell !== undefined);
    }

    createRows = () => {
        const { rows, columns, actions } = this.props;

        if (rows.length === 0) {
            return [{
                cells: [{
                    title: (
                        <EmptyTable>
                            There are no items in inventory. If that&apos;s incorrect, contact your administrator!
                        </EmptyTable>
                    ),
                    props: {
                        colSpan: columns.length + Boolean(actions)
                    }
                }]
            }];
        }

        return rows
        .map((oneItem) => ({
            ...oneItem,
            cells: this.buildCells(oneItem)
        }));
    }

    createColumns = () => {
        const { columns } = this.props;
        return columns.map(({ props, transforms, ...oneCell }) => ({
            ...oneCell,
            ...props && props.width ? {
                transforms: [
                    ...transforms || [],
                    cellWidth(props.width)
                ]
            } : { transforms: [ ...transforms || [] ]}
        }));
    }

    render() {
        const { columns, loaded, expandable, onExpandClick, hasCheckbox, actions, variant } = this.props;
        return (
            <React.Fragment>
                { loaded ?
                    <PfTable
                        variant={ variant }
                        aria-label="Host inventory"
                        cells={ this.createColumns() }
                        rows={ this.createRows() }
                        gridBreakPoint={ columns.length > 5 ? TableGridBreakpoint.gridLg : TableGridBreakpoint.gridMd }
                        className="ins-c-entity-table"
                        { ...{
                            ...hasCheckbox ? { onSelect: this.onItemSelect } : {},
                            ...expandable ? { onCollapse: onExpandClick } : {},
                            ...actions ? { actions } : {}
                        } }
                    >
                        <TableHeader />
                        <TableBody />
                    </PfTable> :
                    <SkeletonTable colSize={ 2 } rowSize={ 15 } />
                }
            </React.Fragment>
        );
    }
}

EntityTable.propTypes = {
    variant: PropTypes.oneOf(Object.values(TableVariant)),
    history: PropTypes.any,
    expandable: PropTypes.bool,
    onExpandClick: PropTypes.func,
    setSort: PropTypes.func,
    hasCheckbox: PropTypes.bool,
    showActions: PropTypes.bool,
    rows: PropTypes.arrayOf(PropTypes.any),
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        composed: PropTypes.arrayOf(PropTypes.string)
    })),
    showHealth: PropTypes.bool,
    match: PropTypes.any,
    loaded: PropTypes.bool,
    items: PropTypes.array,
    sortBy: PropTypes.shape({
        key: PropTypes.string,
        direction: PropTypes.oneOf([ 'asc', 'desc' ])
    }),
    selectEntity: PropTypes.func,
    onDetailSelect: PropTypes.func
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
    onDetailSelect: () => undefined
};

function mapDispatchToProps(dispatch) {
    return {
        selectEntity: (id, isSelected) => dispatch(selectEntity(id, isSelected)),
        setSort: (id, isSelected) => dispatch(setSort(id, isSelected)),
        onDetailSelect: (name) => dispatch(detailSelect(name))
    };
}

function mapStateToProps({ entities: { columns, rows, loaded, sortBy }}) {
    return {
        columns,
        loaded,
        rows,
        sortBy
    };
}

export default routerParams(connect(mapStateToProps, mapDispatchToProps)(EntityTable));
