import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InventoryEntityTable from './EntityTable';
import { Grid, GridItem } from '@patternfly/react-core/dist/esm/layouts/Grid';
import PropTypes from 'prop-types';
import './InventoryList.scss';
import { InventoryContext, loadSystems } from '../../shared';
import { CancelToken } from 'axios';
import isEqual from 'lodash/isEqual';

class ContextInventoryList extends React.Component {
    constructor(props) {
        super(props);
    }

    loadEntities = (options = {}) => {
        const { page, perPage, items, hasItems, sortBy, activeFilters } = this.props;
        const currPerPage = options.per_page || perPage;
        if (this.controller) {
            this.controller.cancel('Get host items canceled by user.');
        }

        this.controller = CancelToken.source();
        this.props.loadEntities && this.props.loadEntities({
            page: (hasItems && items.length <= currPerPage) ? 1 : (options.page || page),
            // eslint-disable-next-line camelcase
            per_page: currPerPage,
            orderBy: !hasItems && (sortBy && sortBy.key),
            orderDirection: !hasItems && (sortBy && sortBy.direction.toUpperCase()),
            filters: activeFilters,
            controller: this.controller,
            hasItems,
            ...options
        });
    }

    componentDidMount() {
        const { setRefresh } = this.props;
        setRefresh && setRefresh(this.loadEntities);
        this.loadEntities();
    }

    componentDidUpdate(prevProps) {
        const { items, hasItems, sortBy } = this.props;
        if (
            hasItems &&
            !isEqual(
                items.map(({ children, isOpen, ...item }) => item),
                prevProps.items.map(({ children, isOpen, ...item }) => item)
            )
        ) {
            this.loadEntities({});
        } else if (!hasItems && !isEqual(prevProps.sortBy, sortBy)) {
            this.loadEntities({});
        }
    }

    render() {
        const { showHealth, ...props } = this.props;
        return (
            <React.Fragment>
                <Grid guttter="sm" className="ins-inventory-list">
                    <GridItem span={ 12 }>
                        <InventoryEntityTable { ...props } />
                    </GridItem>
                </Grid>
            </React.Fragment>
        );
    }
}

const InventoryList = (props) => {
    const dispatch = useDispatch();
    const activeFilters = useSelector(({ entities: { activeFilters } }) => activeFilters);
    return (
        <InventoryContext.Consumer>
            { ({ setRefresh, setUpdate }) => (
                <ContextInventoryList
                    { ...props }
                    activeFilters={ activeFilters }
                    setRefresh={ setRefresh }
                    setUpdate={ setUpdate }
                    loadEntities={ (config) => dispatch(loadSystems(props.items, config, props.showTags)) }
                />
            ) }
        </InventoryContext.Consumer>
    );
};

ContextInventoryList.propTypes = {
    ...InventoryList.propTypes,
    setRefresh: PropTypes.func
};
ContextInventoryList.defaultProps = {
    perPage: 50,
    page: 1,
    onRefresh: () => undefined
};
InventoryList.propTypes = {
    showTags: PropTypes.bool,
    filterEntities: PropTypes.func,
    loadEntities: PropTypes.func,
    showHealth: PropTypes.bool,
    page: PropTypes.number,
    perPage: PropTypes.number,
    onRefresh: PropTypes.func,
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
