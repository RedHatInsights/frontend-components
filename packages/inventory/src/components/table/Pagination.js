/* eslint-disable camelcase */
import React from 'react';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { entitiesLoading } from '../../redux/actions';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { loadSystems } from '../../shared';

/**
 * Bottom pagination used in table. It can remember what page user is on if user entered the page number in input.
 */
const FooterPagination = ({
    total,
    page,
    perPage,
    isLoaded,
    direction,
    isFull,
    hasItems,
    hasAccess,
    sortBy,
    items,
    onRefresh,
    customFilters,
    hideFilters,
    showTags,
    getEntities,
    paginationProps
}) => {
    const dispatch = useDispatch();
    const loaded = useSelector(store => store?.entities?.loaded);
    const filters = useSelector(store => store?.entities?.activeFilters, shallowEqual);

    const loadEntities = (config) => dispatch(
        loadSystems(
            {
                orderBy: sortBy?.key,
                orderDirection: sortBy?.direction,
                ...config
            },
            showTags,
            getEntities
        )
    );

    /**
     * Actual function called when updating any part of pagination.
     * It either calls `onRefresh` from props if passed or dispatches new action `loadEntities`.
     * @param {*} config contains new pagination config.
     */
    const updatePagination = (config) => {
        const pagination = {
            page, per_page: perPage, filters, sortBy, hasItems, items, ...config
        };

        if (onRefresh) {
            dispatch(entitiesLoading());
            onRefresh(pagination, (options) => loadEntities({
                ...customFilters,
                ...options,
                hideFilters
            }));
        } else {
            loadEntities({
                ...customFilters,
                ...pagination,
                hideFilters
            });
        }
    };

    /**
     * Thi method sets new page and combines previous props to apply sort, filters etc.
     * @param {*} event html event to figure if target was input.
     * @param {*} page current page to change to.
     */
    const onSetPage = (_event, pageArg) => updatePagination({ page: pageArg });

    /**
     * This method changes per page, it automatically sets page to first one.
     * It also applies previous sort, filters, etc.
     * @param {*} _event event is now not used.
     * @param {*} perPage new perPage set by user.
     */
    const onPerPageSelect = (_event, perPageArg) => updatePagination({ page: 1, per_page: perPageArg });

    const finalIsLoaded = hasItems && isLoaded !== undefined ? (isLoaded && loaded) : loaded;

    return (finalIsLoaded || !hasAccess) ? (
        <Pagination
            { ...isFull && {
                variant: PaginationVariant.bottom
            } }
            isDisabled={!hasAccess}
            itemCount={ total }
            page={ page }
            perPage={ perPage }
            dropDirection={ direction }
            onSetPage={ onSetPage }
            onPerPageSelect={ onPerPageSelect }
            {...paginationProps}
        />
    ) : null;
};

FooterPagination.propTypes = {
    perPage: PropTypes.number,
    total: PropTypes.number,
    loaded: PropTypes.bool,
    isFull: PropTypes.bool,
    hasAccess: PropTypes.bool,
    onRefresh: PropTypes.func,
    direction: PropTypes.string,
    customFilters: PropTypes.shape({
        tags: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.arrayOf(PropTypes.string)
        ])
    }),
    getEntities: PropTypes.func,
    hideFilters: PropTypes.shape({
        tags: PropTypes.bool,
        name: PropTypes.bool,
        registeredWith: PropTypes.bool,
        stale: PropTypes.bool
    }),
    paginationProps: PropTypes.object
};

FooterPagination.defaultProps = {
    total: 0,
    loaded: false,
    isFull: false,
    direction: 'up',
    hasAccess: true
};

export default FooterPagination;
