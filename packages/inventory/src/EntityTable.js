import React from 'react';
import PropTypes from 'prop-types';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import { selectEntity, setSort, detailSelect } from './redux/actions';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
    Title,
    EmptyStateBody,
    Bullseye,
    EmptyState,
    EmptyStateVariant
} from '@patternfly/react-core';
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
import { SkeletonTable, EmptyTable, DateFormat } from '@redhat-cloud-services/frontend-components';
import TagsModal from './TagsModal';

class EntityTable extends React.Component {
    onRowClick = (_event, key, application) => {
        const { match: { url }, history, onDetailSelect, loaded } = this.props;
        if (loaded) {
            const dilimeter = url.substr(-1, 1) === '/' ? '' : '/';
            const isMetaKey = (event.ctrlKey || event.metaKey || event.which === 2);
            if (isMetaKey) {
                window.open(`${location.pathname}/${key}`);
            } else {
                history.push(`${url}${dilimeter}${key}/${application ? application : ''}`);
                onDetailSelect && onDetailSelect(application);
            }
        }
    }

    onItemSelect = (_event, checked, rowId) => {
        const { rows, expandable: isExpandable } = this.props;
        const row = isExpandable ? rows[rowId / 2] : rows[rowId];
        this.props.selectEntity && this.props.selectEntity(rowId === -1 ? 0 : row.id, checked);
    }

    onSort = (_event, key, direction) => {
        if (key !== 'action' && key !== 'health') {
            this.props.setSort && this.props.setSort(key, direction);
        }
    }

    renderCol = (col, key, composed, isTime) => {
        if (composed) {
            return (
                { title: <div className="ins-composed-col">
                    { composed.map(path => (
                        <a key={ path }
                            widget="col"
                            data-key={ path }
                            href={ `${location.pathname}${location.pathname.substr(-1) === '/' ? '' : '/'}${col.id}` }
                            onClick={ event => {
                                event.preventDefault();
                                event.stopPropagation();
                                this.onRowClick(event, col.id);
                            }}
                        >
                            { get(col, path, ' ') || '\u00A0' }
                        </a>
                    )) }
                </div>
                }
            );
        }

        if (isTime) {
            if (DateFormat) {
                return { title: <DateFormat date={get(col, key, ' ')} type="relative" /> };
            }

            const [ , date, month, year, time ] = new Date(get(col, key, ' ')).toUTCString().split(' ');
            if (date && month && year && time) {
                return `${date} ${month} ${year}, ${time.split(':').slice(0, 2).join(':')} UTC`;
            }

            return 'Invalid Date';
        }

        return get(col, key, ' ');
    }

    buildCells = (item) => ([
        ...this.props.columns.map(({ key, composed, isTime, renderFunc }) => {
            const oneColumn = this.renderCol(item, key, composed, isTime, renderFunc);
            return renderFunc ? {
                title: renderFunc(oneColumn, item.id, item)
            } : oneColumn;
        })
    ].filter(cell => cell !== false && cell !== undefined))

    createRows = () => {
        const { rows, columns, actions, expandable } = this.props;

        if (rows.length === 0) {
            return [{
                cells: [{
                    title: (
                        <EmptyTable>
                            <Bullseye>
                                <EmptyState variant={ EmptyStateVariant.full }>
                                    <Title headingLevel="h5" size="lg">
                                        No matching systems found
                                    </Title>
                                    <EmptyStateBody>
                                        This filter criteria matches no systems. <br /> Try changing your filter settings.
                                    </EmptyStateBody>
                                </EmptyState>
                            </Bullseye>
                        </EmptyTable>
                    ),
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

    buildTransforms = (props, transforms, hasItems, rows) => {
        return ([
            ...transforms || [],
            ...props && props.width ? [ cellWidth(props.width) ] : [],
            ...hasItems || rows.length <= 0 || (props && props.isStatic) ? [] : [ sortable ]
        ]);
    }

    createColumns = () => {
        const { columns, hasItems, rows, expandable: isExpandable } = this.props;
        return columns.map(({ props, transforms, ...oneCell }) => ({
            ...oneCell,
            transforms: [
                ...this.buildTransforms(props, transforms, hasItems, rows) || []
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
            tableProps
        } = this.props;
        const cells = loaded && this.createColumns();

        return (
            <React.Fragment>
                { loaded ?
                    PfTable && <PfTable
                        borders={ true }
                        variant={ variant }
                        aria-label="Host inventory"
                        cells={ cells }
                        rows={ this.createRows() }
                        gridBreakPoint={ columns.length > 5 ? TableGridBreakpoint.gridLg : TableGridBreakpoint.gridMd }
                        className="ins-c-entity-table"
                        onSort={ (event, index, direction) => {
                            this.onSort(event, cells[index - Boolean(hasCheckbox) - Boolean(expandable)].key, direction);
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
                        <TableBody onRowClick={ (event, { selected }, { rowIndex }) => {
                            if (hasCheckbox && event.target.matches('td')) {
                                this.onItemSelect(event, !selected, rowIndex);
                            }
                        } } />
                    </PfTable> :
                    <SkeletonTable colSize={ 2 } rowSize={ 15 } />
                }
                <TagsModal />
            </React.Fragment>
        );
    }
}

EntityTable.propTypes = {
    variant: PropTypes.oneOf(Object.values(TableVariant || {})),
    history: PropTypes.any,
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
    match: PropTypes.any,
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
    onDetailSelect: PropTypes.func,
    onToggleTagModal: PropTypes.func
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
    onDetailSelect: () => undefined,
    onToggleTagModal: () => undefined,
    tableProps: {}
};

function mapDispatchToProps(dispatch) {
    return {
        selectEntity: (id, isSelected) => dispatch(selectEntity(id, isSelected)),
        setSort: (id, sortDirection) => dispatch(setSort(id, sortDirection)),
        onDetailSelect: (name) => dispatch(detailSelect(name))
    };
}

function mapStateToProps({ entities: { columns, rows, loaded, sortBy } }) {
    return {
        columns,
        loaded,
        rows,
        sortBy
    };
}

export default routerParams(connect(mapStateToProps, mapDispatchToProps)(EntityTable));
