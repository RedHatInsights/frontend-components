import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Button, Dropdown, DropdownToggle } from '@patternfly/react-core';
import { SimpleTableFilter } from '../../../PresentationalComponents/SimpleTableFilter';
import { connect } from 'react-redux';
import { filterSelect } from '../../../redux/actions/inventory';
import { SyncAltIcon } from '@patternfly/react-icons';
import { InventoryContext } from '../Inventory';
import FilterItem from './FilterItem';
import flatMap from 'lodash/flatMap';

function generateFilters(filters = [], activeFilters) {
    const calculateFilter = (filter, { value }) => ({
        ...filter,
        selected: !!activeFilters.find(item => item.value === filter.value),
        group: value
    });

    const allFilters = [
        ...filters
    ];
    return allFilters && flatMap(allFilters, ({ items, ...filter }) => ([
        {
            filter,
            isDisabled: true
        },
        ...items ? flatMap(items, ({ items: subItems, ...subFilter }) => ([
            {
                filter: {
                    ...calculateFilter(subFilter, filter),
                    items: subItems
                }
            },
            ...subItems ? subItems.map(itemFilter => ({
                filter: calculateFilter(itemFilter, filter),
                pad: 1
            })) : []
        ])) : []
    ]));
}

class ContextFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterByString: '',
            isOpen: false,
            filters: []
        };
    }

    componentDidMount() {
        this.setState({
            filters: generateFilters(this.props.filters, this.props.activeFilters)
        });
    }

    onFilterByString = (_event, selected) => {
        this.setState({
            filterByString: selected.title
        });
    }

    onToggle = isOpen => {
        this.setState({
            isOpen
        });
    };

    onFilterClick = (_event, { selected, ...item }, key) => {
        const { filters } = this.state;
        const { onRefreshData } = this.props;
        const values = filters.map(({ filter }) => filter.value);
        filters[key].filter.selected = !filters[key].filter.selected;

        if (item.hasOwnProperty('items') && item.items) {
            item.items.forEach(subItem => {
                const index = values.indexOf(subItem.value);
                filters[index].filter.selected = filters[key].filter.selected;
            });
        }

        this.props.onFilterSelect({ item, selected: filters[key].filter.selected });
        this.setState({
            filters
        }, () => onRefreshData({ filters: this.props.activeFilters, page: 1 }));
    }

    filterEntities = (value, selected) => {
        const { columns } = this.props;
        const filteredColumns = columns.filter(column => !column.isTime);
        if (!selected) {
            selected = filteredColumns && filteredColumns.length > 0 ? {
                ...filteredColumns[0],
                value: filteredColumns[0].key
            } : undefined;
        }

        if (selected) {
            const { onRefreshData } = this.props;
            const textualFilter = { value: selected.value, filter: value };
            const { filters } = this.state;
            this.props.onFilterSelect({ item: textualFilter, selected: true });
            this.setState({
                filters
            }, () => onRefreshData({ filters: this.props.activeFilters, page: 1 }));
        }
    }

    render() {
        const { columns, total, children, hasItems } = this.props;
        const { filterByString, isOpen, filters } = this.state;
        const filteredColumns = columns && columns.filter(column => !column.isTime);
        const placeholder = filterByString || (filteredColumns && filteredColumns.length > 0 && filteredColumns[0].title);
        return (
            <Grid guttter="sm" className="ins-inventory-filters">
                {
                    !hasItems &&
                    <GridItem span={ 4 } className="ins-inventory-text-filter">
                        <SimpleTableFilter
                            options={
                                filteredColumns && filteredColumns.length > 1 ? {
                                    title: columns[0].title,
                                    items: columns.map(column => ({
                                        ...column,
                                        value: column.key
                                    }))
                                } : undefined
                            }
                            onOptionSelect={ this.onFilterByString }
                            onFilterChange={ this.filterEntities }
                            placeholder={ `Find system by ${placeholder}` }
                            buttonTitle=""
                        />
                    </GridItem>
                }
                {
                    filters && filters.length > 0 &&
                    <GridItem span={ 1 } className="ins-inventory-filter">
                        <Dropdown
                            isOpen={ isOpen }
                            dropdownItems={ filters.map((item, key) => (
                                <FilterItem
                                    { ...item }
                                    key={ key }
                                    data-key={ key }
                                    onClick={ (event) => this.onFilterClick(event, item.filter, key) }
                                />
                            )) }
                            toggle={ <DropdownToggle onToggle={ this.onToggle }>Filter</DropdownToggle> }
                        />
                    </GridItem>
                }
                <GridItem span={ hasItems ? 10 : 6 }>
                    { children }
                </GridItem>
                <GridItem span={ 1 } className="ins-inventory-total pf-u-display-flex pf-u-align-items-center">
                    { total > 0 && <div>{ total } result{ total > 1 && 's' }</div> }
                    { /* <Button
                        variant="plain"
                        className="ins-refresh"
                        title="Refresh"
                        aria-label="Refresh"
                        onClick={ _event => onRefreshData() }
                    >
                        <SyncAltIcon />
                    </Button> */ }
                </GridItem>
            </Grid>
        );
    }
}

const Filter = ({ ...props }) => (
    <InventoryContext.Consumer>
        { ({ onRefreshData }) => (
            <ContextFilter { ...props } onRefreshData={ onRefreshData } />
        ) }
    </InventoryContext.Consumer>
);

Filter.propTypes = {
    filters: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        value: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            value: PropTypes.string,
            items: PropTypes.arrayOf(PropTypes.shape({
                title: PropTypes.string,
                value: PropTypes.string
            }))
        }))
    })),
    activeFilters: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        value: PropTypes.string
    })),
    hasItems: PropTypes.bool
};
Filter.defaultProps = {
    filters: [],
    activeFilters: [],
    onFilterSelect: () => undefined
};

function mapStateToProps({ entities: { columns, total, activeFilters }}, { totalItems }) {
    return {
        columns,
        total: totalItems || total,
        activeFilters
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onFilterSelect: (filter) => dispatch(filterSelect(filter))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
