/* eslint-disable camelcase */
import React, { Fragment, forwardRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual, useStore, useDispatch } from 'react-redux';
import EntityTableToolbar from './EntityTableToolbar';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/TableToolbar';
import { ErrorState } from '@redhat-cloud-services/frontend-components/ErrorState';
import InventoryList from './InventoryList';
import Pagination from './Pagination';
import AccessDenied from '../../shared/AccessDenied';
import { loadSystems } from '../../shared';
import isEqual from 'lodash/isEqual';
import { entitiesLoading } from '../../redux/actions';
import InventoryTableV2 from '../table-v2';

/**
 * A helper function to store props and to always return the latest state.
 * For example, EntityTableToolbar wraps OnRefreshData in a callback, so we need this
 * to get the latest props and not the props at the time of when the function is
 * being wrapped in callback.
 */
const propsCache = () => {
    let cache = {};

    const updateProps = (props) => { cache = props; };

    const getProps = () => cache;

    return { updateProps, getProps };
};

/**
 * This component is used to combine all essential components together:
 *   * EntityTableToolbar - to control top toolbar.
 *   * InventoryList - to allow consumers to change data from outside and contains actual inventory table.
 *   * Pagination - bottom pagination.
 * It also calculates pagination and sortBy from props or from store if consumer passed items or not.
 */

const InventoryTable = forwardRef(({ // eslint-disable-line react/display-name
    onRefresh,
    children,
    inventoryRef,
    items,
    total: propsTotal,
    page: propsPage,
    perPage: propsPerPage,
    filters,
    showTags,
    sortBy: propsSortBy,
    customFilters,
    hasAccess = true,
    isFullView = false,
    getEntities,
    hideFilters,
    paginationProps,
    errorState = <ErrorState />,
    autoRefresh,
    isLoaded,
    initialLoading,
    ignoreRefresh,
    showTagModal,
    ...props
}, ref) => {
    const hasItems = Boolean(items);
    const error = useSelector(({ entities }) => (
        entities?.error
    ));
    const page = useSelector(({ entities: { page: invPage } }) => (
        hasItems ? propsPage : (invPage || 1)
    )
    , shallowEqual);
    const perPage = useSelector(({ entities: { perPage: invPerPage } }) => (
        hasItems ? propsPerPage : (invPerPage || 50)
    )
    , shallowEqual);
    const total = useSelector(({ entities: { total: invTotal } }) => {
        if (hasItems) {
            return propsTotal !== undefined ? propsTotal : items?.length;
        }

        return invTotal;
    }, shallowEqual);
    const pagination = {
        page,
        perPage,
        total
    };
    const sortBy = useSelector(({ entities: { sortBy: invSortBy } }) => (
        hasItems ? propsSortBy : invSortBy
    ), shallowEqual);

    const reduxLoaded = useSelector(({ entities }) => (
        hasItems && isLoaded !== undefined ? (isLoaded && entities?.loaded) : entities?.loaded
    ));

    /**
     * If initialLoading is set to true, then the component should be in loading state until
     * entities.loaded is false (and then we can use the redux loading state and forget this one)
     */
    const [ initialLoadingActive, disableInitialLoading ] = useState(initialLoading);
    useEffect(() => {
        if (!reduxLoaded) {
            disableInitialLoading();
        }
    }, [ reduxLoaded ]);
    const loaded = reduxLoaded && !initialLoadingActive;

    const dispatch = useDispatch();
    const store = useStore();

    const cache = useRef(propsCache());
    cache.current.updateProps({
        page,
        perPage,
        items,
        sortBy,
        hideFilters,
        showTags,
        getEntities,
        customFilters,
        hasItems
    });

    /**
     * If consumer wants to change data they can call this function via component ref.
     * @param {*} options new options to be applied, like pagination, filters, etc.
     */
    const onRefreshData = (options = {}, disableOnRefresh) => {
        const { activeFilters } = store.getState().entities;
        const cachedProps = cache.current?.getProps() || {};

        // eslint-disable-next-line camelcase
        const currPerPage = options?.per_page || options?.perPage || cachedProps.perPage;

        const params = {
            page: cachedProps.page,
            per_page: currPerPage,
            items: cachedProps.items,
            sortBy: cachedProps.sortBy,
            hideFilters: cachedProps.hideFilters,
            filters: activeFilters,
            hasItems: cachedProps.hasItems,
            ...cachedProps.customFilters,
            ...options
        };

        if (onRefresh && !disableOnRefresh) {
            dispatch(entitiesLoading());
            onRefresh(params, (options) => {
                dispatch(
                    loadSystems(
                        { ...params, ...options },
                        cachedProps.showTags,
                        cachedProps.getEntities
                    )
                );
            });
        } else {
            dispatch(
                loadSystems(
                    params,
                    cachedProps.showTags,
                    cachedProps.getEntities
                )
            );
        }
    };

    const prevFilters = useRef(customFilters);
    useEffect(() => {
        if (autoRefresh && !isEqual(prevFilters.current, customFilters)) {
            onRefreshData({ page: 1 });
            prevFilters.current = customFilters;
        }
    });

    return (
        (hasAccess === false && isFullView) ?
            <AccessDenied
                title="This application requires Inventory permissions"
                description={<div>
                    To view the content of this page, you must be granted a minimum of inventory permissions from your Organization Administrator.
                </div>}
            /> :
            !error ? <Fragment>
                <EntityTableToolbar
                    { ...props }
                    customFilters={customFilters}
                    hasAccess={hasAccess}
                    items={ items }
                    filters={ filters }
                    hasItems={ hasItems }
                    total={ pagination.total }
                    page={ pagination.page }
                    perPage={ pagination.perPage }
                    showTags={ showTags }
                    onRefreshData={onRefreshData}
                    sortBy={ sortBy }
                    hideFilters={hideFilters}
                    paginationProps={paginationProps}
                    loaded={loaded}
                    showTagModal={showTagModal}
                >
                    { children }
                </EntityTableToolbar>
                <InventoryList
                    { ...props }
                    customFilters={customFilters}
                    hasAccess={hasAccess}
                    ref={ref}
                    hasItems={ hasItems }
                    items={ items }
                    page={ pagination.page }
                    sortBy={ sortBy }
                    perPage={ pagination.perPage }
                    showTags={ showTags }
                    onRefreshData={onRefreshData}
                    loaded={loaded}
                    ignoreRefresh={ignoreRefresh}
                />
                <TableToolbar isFooter className="ins-c-inventory__table--toolbar">
                    <Pagination
                        hasAccess={hasAccess}
                        isFull
                        total={ pagination.total }
                        page={ pagination.page }
                        perPage={ pagination.perPage }
                        hasItems={ hasItems }
                        onRefreshData={onRefreshData}
                        paginationProps={paginationProps}
                        loaded={loaded}
                    />
                </TableToolbar>
            </Fragment> : errorState
    );
});

InventoryTable.propTypes = {
    autoRefresh: PropTypes.bool,
    onRefresh: PropTypes.func,
    children: PropTypes.node,
    inventoryRef: PropTypes.object,
    items: PropTypes.array,
    total: PropTypes.number,
    page: PropTypes.number,
    perPage: PropTypes.number,
    filters: PropTypes.any,
    showTags: PropTypes.bool,
    sortBy: PropTypes.object,
    customFilters: PropTypes.any,
    hasAccess: PropTypes.bool,
    isFullView: PropTypes.bool,
    getEntities: PropTypes.func,
    hideFilters: PropTypes.object,
    paginationProps: PropTypes.object,
    errorState: PropTypes.node,
    isLoaded: PropTypes.bool,
    initialLoading: PropTypes.bool,
    ignoreRefresh: PropTypes.bool,
    showTagModal: PropTypes.bool
};

const TablesWrapper = ({ v2, ...props }) => v2 ? <InventoryTableV2 {...props} /> : <InventoryTable {...props} />;

TablesWrapper.propTypes = {
    v2: PropTypes.bool
};

export default TablesWrapper;
