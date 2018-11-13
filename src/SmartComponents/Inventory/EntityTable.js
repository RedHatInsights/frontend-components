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

class EntityTable extends React.Component {
    constructor(props) {
        super(props);
        this.onRowClick = this.onRowClick.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
        this.onSort = this.onSort.bind(this);
        this.healthColumn = this.healthColumn.bind(this);
        this.state = {
            sortBy: {}
        };
    }

    onRowClick(_event, key, application) {
        const { match: { path }, history, onDetailSelect } = this.props;
        const dilimeter = path.substr(-1, 1) === '/' ? '' : '/';
        history.push(`${path}${dilimeter}${key}/${application ? application : ''}`);
        onDetailSelect && onDetailSelect(application);
    }

    onItemSelect(_event, key, checked) {
        this.props.selectEntity && this.props.selectEntity(key, checked);
    }

    onSort(_event, key, direction) {
        if (key !== 'action' && key !== 'health') {
            this.props.setSort && this.props.setSort(key, direction);
            this.setState({
                sortBy: {
                    index: key,
                    direction
                }
            });
        }
    }

    renderCol(col, key, composed, isTime) {
        if (composed) {
            return (
                <div className="ins-composed-col">
                    { composed.map(path => (
                        <div key={ path } widget="col" data-key={ path }>
                            { get(col, path, 'unknown') || '\u00A0' }
                        </div>
                    )) }
                </div>
            );
        }

        if (isTime) {
            return (new Date(get(col, key, 'unknown'))).toLocaleString();
        }

        return get(col, key, 'unknown');
    }

    onHealthClicked(event, _clickedOn, health, item) {
        this.onRowClick(event, item.id, health.redirect);
    }

    healthColumn(oneItem) {
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

    actionsColumn(oneItem) {
        return {
            title: <TableActions item={ { id: oneItem.id } } />,
            className: 'pf-c-table__action pf-m-shrink',
            stopPropagation: true
        };
    }

    render() {
        const { columns, entities, rows } = this.props;
        const filteredData = entities || rows;
        const data = filteredData.map(oneItem => ({
            id: oneItem.id,
            selected: oneItem.selected,
            cells: [
                ...columns.map(oneCell => this.renderCol(oneItem, oneCell.key, oneCell.composed, oneCell.isTime)),
                this.healthColumn(oneItem),
                this.actionsColumn(oneItem)
            ]
        }));
        return <Table
            className="pf-m-compact ins-entity-table"
            sortBy={ this.state.sortBy }
            header={ columns && {
                ...mapValues(keyBy(columns, item => item.key), item => item.title),
                health: {
                    title: 'Health',
                    hasSort: false
                },
                action: ''
            } }
            onSort={ this.onSort }
            onRowClick={ this.onRowClick }
            onItemSelect={ this.onItemSelect }
            hasCheckbox
            rows={ data }
        />;
    }
}

EntityTable.propTypes = {
    history: PropTypes.any,
    setSort: PropTypes.func,
    rows: PropTypes.arrayOf(PropTypes.any),
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        composed: PropTypes.arrayOf(PropTypes.string)
    })),
    match: PropTypes.any,
    loaded: PropTypes.bool,
    entities: PropTypes.array,
    selectEntity: PropTypes.func,
    onDetailSelect: PropTypes.func
};

EntityTable.defaultProps = {
    loaded: false,
    columns: [],
    entities: [],
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

function mapStateToProps({ entities: { columns, entities, rows, loaded }}) {
    return {
        entities,
        columns,
        loaded,
        rows
    };
}

export default routerParams(connect(mapStateToProps, mapDispatchToProps)(EntityTable));
