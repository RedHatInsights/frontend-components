import React from 'react';
import PropTypes from 'prop-types';
import routerParams from '../../Utilities/RouterParams';
import { selectEntity, setSort, detailSelect } from '../../redux/actions/inventory';
import { connect } from 'react-redux';
import { Table } from '../../PresentationalComponents/Table';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import TableActions from './Actions';
import HealthStatus from './HealthStatus';
import get from 'lodash/get';
import { RowLoader } from '../../Utilities/helpers';
import orderBy from 'lodash/orderBy';

class EntityTable extends React.Component {
    onRowClick = (_event, key, application) => {
        const { match: { url }, history, onDetailSelect, loaded } = this.props;
        if (loaded) {
            const dilimeter = url.substr(-1, 1) === '/' ? '' : '/';
            history.push(`${url}${dilimeter}${key}/${application ? application : ''}`);
            onDetailSelect && onDetailSelect(application);
        }
    }

    onItemSelect = (_event, key, checked) => {
        this.props.selectEntity && this.props.selectEntity(key, checked);
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
                                { get(col, path, 'Unknown') || '\u00A0' }
                            </div>
                        )) }
                    </div>
                );
            }

            if (isTime) {
                return (new Date(get(col, key, 'Unknown'))).toLocaleString();
            }
        }

        return get(col, key, 'Unknown');
    }

    onHealthClicked = (event, _clickedOn, health, item) => {
        this.onRowClick(event, item.id, health.redirect);
    }

    healthColumn = (oneItem) => {
        return {
            title: <HealthStatus
                items={ oneItem.health }
                className="ins-health-status"
                onHealthClicked={
                    (event, clickedOn, health) => this.onHealthClicked(event, clickedOn, health, oneItem)
                }
            />,
            className: 'pf-m-fit-content',
            stopPropagation: true
        };
    }

    actionsColumn = (oneItem) => {
        return {
            title: <TableActions item={ { id: oneItem.id } } />,
            className: 'pf-c-table__action pf-m-shrink',
            stopPropagation: true
        };
    }

    buildCells = (item) => {
        const { columns, showHealth } = this.props;
        if (item.hasOwnProperty('isOpen')) {
            return [{
                title: item.title,
                colSpan: columns.length + 1 + showHealth
            }];
        }

        return [
            ...columns.map(({ key, composed, isTime }) => this.renderCol(item, key, composed, isTime)),
            showHealth && this.healthColumn(item),
            this.actionsColumn(item)
        ].filter(cell => cell !== false && cell !== undefined);
    }

    createRows = () => {
        const { sortBy, rows, showHealth, columns, items } = this.props;
        const data = rows
        .filter(oneRow => oneRow.account)
        .map((oneItem) => ({
            ...oneItem,
            cells: this.buildCells(oneItem)
        }));
        if ((items && items.length === 0) || rows.length === 0) {
            return [{
                cells: [{
                    title: 'There are no items in inventory. If that\'s incorrect, contact your administrator!',
                    colSpan: columns.length + 1 + showHealth
                }]
            }];
        }

        return sortBy ?
            orderBy(
                data,
                [ e => get(e, sortBy.key) ],
                [ sortBy.direction ]
            ) :
            data;
    }

    render() {
        const { columns, showHealth, loaded, sortBy, expandable, onExpandClick, hasCheckbox } = this.props;
        return <Table
            className="pf-m-compact ins-entity-table"
            expandable={ expandable }
            onExpandClick={ onExpandClick }
            sortBy={
                sortBy ?
                    {
                        index: sortBy.key,
                        direction: sortBy.direction === 'asc' ? 'up' : 'down'
                    } :
                    {}
            }
            header={ columns && {
                ...mapValues(keyBy(columns, item => item.key), item => item.title),
                ...showHealth ? {
                    health: {
                        title: 'Health',
                        hasSort: false
                    }
                } : {},
                action: ''
            } }
            onSort={ this.onSort }
            onItemSelect={ this.onItemSelect }
            hasCheckbox={ loaded && hasCheckbox }
            rows={
                loaded ?
                    this.createRows() :
                    [ ...Array(5) ].map(() => ({
                        cells: [{
                            title: <RowLoader />,
                            colSpan: columns.length + showHealth + 1
                        }]
                    }))
            }
        />;
    }
}

EntityTable.propTypes = {
    history: PropTypes.any,
    expandable: PropTypes.bool,
    onExpandClick: PropTypes.func,
    setSort: PropTypes.func,
    hasCheckbox: PropTypes.bool,
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
