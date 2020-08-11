import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InventoryEntityTable from './EntityTable';
import { Grid, GridItem } from '@patternfly/react-core/dist/esm/layouts/Grid';
import PropTypes from 'prop-types';
import './InventoryList.scss';
import { loadSystems } from '../../shared';
import isEqual from 'lodash/isEqual';

/**
 * Component that works as a side channel for consumers to notify inventory of new data changes.
 */
class ContextInventoryList extends React.Component {
    /**
     * If conumer wants to change data they can call this function via component ref.
     * @param {*} options new options to be applied, like pagination, filters, etc.
     */
    onRefreshData = (options = {}) => {
        const { page, perPage, items, hasItems, sortBy, activeFilters, showTags } = this.props;
        this.props.loadEntities && this.props.loadEntities({
            page,
            perPage,
            items,
            hasItems,
            sortBy,
            activeFilters,
            ...options
        }, showTags);
    }

    /**
     * Function to calculate for new changes, this function limits re-renders by checking if previous items are
     * same as new items.
     * If items are not passed, it only checks for props sortBy.
     * @param {*} prevProps previous props - items, hasItems, sortBy.
     */
    componentDidUpdate(prevProps) {
        const { items, hasItems, sortBy } = this.props;
        if (
            hasItems &&
            !isEqual(
                items.map(({ children, isOpen, ...item }) => item),
                prevProps.items.map(({ children, isOpen, ...item }) => item)
            )
        ) {
            this.onRefreshData({});
        } else if (!hasItems && !isEqual(prevProps.sortBy, sortBy)) {
            this.onRefreshData({});
        }
    }

    componentDidMount() {
        this.onRefreshData({});
    }

    render() {
        const { showHealth, ...props } = this.props;
        return (
            <Grid guttter="sm" className="ins-inventory-list">
                <GridItem span={ 12 }>
                    <InventoryEntityTable { ...props } />
                </GridItem>
            </Grid>
        );
    }
}

/**
 * Component that consumes active filters and passes them down to component.
 */
const InventoryList = React.forwardRef((props, ref) => {
    const dispatch = useDispatch();
    const activeFilters = useSelector(({ entities: { activeFilters } }) => activeFilters);
    return (
        <ContextInventoryList
            { ...props }
            ref={ref}
            activeFilters={ activeFilters }
            loadEntities={ (config, showTags) => dispatch(loadSystems(config, showTags)) }
        />
    );
});

ContextInventoryList.propTypes = {
    ...InventoryList.propTypes,
    setRefresh: PropTypes.func
};
ContextInventoryList.defaultProps = {
    perPage: 50,
    page: 1
};
InventoryList.propTypes = {
    showTags: PropTypes.bool,
    filterEntities: PropTypes.func,
    loadEntities: PropTypes.func,
    showHealth: PropTypes.bool,
    page: PropTypes.number,
    perPage: PropTypes.number,
    sortBy: PropTypes.shape({
        key: PropTypes.string,
        direction: PropTypes.string
    }),
    items: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.shape({
            id: PropTypes.string.isRequired
        }),
        PropTypes.shape({
            account: PropTypes.any,
            isOpen: PropTypes.bool,
            title: PropTypes.node
        })
    ]),
    entities: PropTypes.arrayOf(PropTypes.any)
};

export default InventoryList;
