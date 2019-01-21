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
        const { columns, total, children, onRefreshData } = this.props;
        const { filterByString, isOpen, filters } = this.state;
        return (
            <Grid guttter="sm" className="ins-inventory-filters">
                <GridItem span={ 4 } className="ins-inventory-text-filter">
                    <SimpleTableFilter
                        options={ {
                            items: columns && columns.map(column => (
                                !column.isTime && {
                                    ...column,
                                    value: column.key
                                }
                            )).filter(Boolean)
                        } }
                        onOptionSelect={ this.onFilterByString }
                        onFilterChange={ this.filterEntities }
                        placeholder={ `Find system by ${filterByString}` }
                        buttonTitle=""
                    />
                </GridItem>
                <GridItem span={ 1 } className="ins-inventory-filter">
                    { filters && filters.length > 0 && <Dropdown
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
                    /> }
                </GridItem>
                <GridItem span={ 6 }>
                    { children }
                </GridItem>
                <GridItem span={ 1 } className="ins-inventory-total pf-u-display-flex pf-u-align-items-center">
                    { total && <div>{ total } results</div> }
                    <Button
                        variant="plain"
                        className="ins-refresh"
                        title="Refresh"
                        aria-label="Refresh"
                        onClick={ _event => onRefreshData() }
                    >
                        <SyncAltIcon />
                    </Button>
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
    }))
};
Filter.defaultProps = {
    filters: [],
    activeFilters: [],
    onFilterSelect: () => undefined
};

function mapStateToProps({ entities: { columns, total, activeFilters }}) {
    return {
        columns,
        total,
        activeFilters
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onFilterSelect: (filter) => dispatch(filterSelect(filter))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
