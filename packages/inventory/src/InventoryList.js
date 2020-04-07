import React from 'react';
import { connect } from 'react-redux';
import InventoryEntityTable from './EntityTable';
import { loadEntities, showEntities } from './redux/actions';
import { Grid, GridItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import './InventoryList.scss';
import { InventoryContext } from './Inventory';
import { CancelToken } from 'axios';
import isEqual from 'lodash/isEqual';

class ContextInventoryList extends React.Component {
    constructor(props) {
        super(props);
    }

    loadEntities = (options = {}, reload = true) => {
        const { page, perPage, onRefresh, items, hasItems, sortBy, activeFilters } = this.props;
        const currPerPage = options.per_page || perPage;
        options = {
            page: (hasItems && items.length <= currPerPage) ? 1 : (options.page || page),
            // eslint-disable-next-line camelcase
            per_page: currPerPage,
            orderBy: sortBy && sortBy.key,
            orderDirection: sortBy && sortBy.direction.toUpperCase(),
            filters: activeFilters,
            ...options
        };
        reload && onRefresh(options);
        if (this.controller) {
            this.controller.cancel('Get host items canceled by user.');
        }

        this.controller = CancelToken.source();
        this.props.loadEntities && this.props.loadEntities(
            items,
            {
                ...options,
                controller: this.controller,
                prefix: this.props.pathPrefix,
                base: this.props.apiBase,
                hasItems
            }
        );
    }

    componentDidMount() {
        const { setRefresh, setUpdate } = this.props;
        setRefresh && setRefresh(this.loadEntities);
        setUpdate && setUpdate((options) => this.loadEntities(options, false));
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
            this.loadEntities({}, false);
        } else if (!hasItems && !isEqual(prevProps.sortBy, sortBy)) {
            this.loadEntities({}, false);
        }
    }

    render() {
        const { showHealth, ...props } = this.props;
        return (
            <React.Fragment>
                <Grid guttter="sm" className="ins-inventory-list">
                    <GridItem span={ 12 }>
                        <InventoryEntityTable { ...props } showHealth={ showHealth } />
                    </GridItem>
                </Grid>
            </React.Fragment>
        );
    }
}

const propTypes = {
    showTags: PropTypes.bool,
    filterEntities: PropTypes.func,
    loadEntities: PropTypes.func,
    pathPrefix: PropTypes.number,
    apiBase: PropTypes.string,
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

ContextInventoryList.propTypes = {
    ...propTypes,
    setRefresh: PropTypes.func
};

ContextInventoryList.defaultProps = {
    perPage: 50,
    page: 1,
    onRefresh: () => undefined
};

const InventoryList = ({ ...props }) => (
    <InventoryContext.Consumer>
        { ({ setRefresh, setUpdate }) => (
            <ContextInventoryList { ...props } setRefresh={ setRefresh } setUpdate={ setUpdate } />
        ) }
    </InventoryContext.Consumer>
);

InventoryList.propTypes = propTypes;

function mapDispatchToProps(dispatch, { showTags }) {
    return {
        loadEntities: (items = [], config) => {
            if (!Array.isArray(items)) {
                console.error('Wrong shape of items, array with strings or objects with ID property required!');
            }

            const limitedItems = items.slice((config.page - 1) * config.per_page, config.page * config.per_page);

            if (limitedItems.length > 0) {
                config.itemsPage = config.page;
                config.page = 1;
            }

            const itemIds = limitedItems.reduce((acc, curr) => (
                [
                    ...acc,
                    curr && typeof curr === 'string' ? curr : curr.id
                ]
            ), []).filter(Boolean);
            dispatch(loadEntities(itemIds, config, { showTags }));
            dispatch(showEntities(limitedItems.map(oneItem => (
                { ...typeof oneItem === 'string' ? { id: oneItem } : oneItem }
            ))));
        }
    };
}

export default connect(
    ({ entities: { page, perPage, sortBy, activeFilters } }, { perPage: currPerPage }) => (
        { page, perPage: currPerPage || perPage, sortBy, activeFilters }
    ),
    mapDispatchToProps
)(InventoryList);
