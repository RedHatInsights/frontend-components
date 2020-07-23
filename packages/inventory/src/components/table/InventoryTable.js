import React, { Fragment, forwardRef } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import EntityTableToolbar from './EntityTableToolbar';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/esm/TableToolbar';
import InventoryList from './InventoryList';
import Pagination from './Pagination';

/**
 * This component is used to combine all essential components together:
 *   * EntityTableToolbar - to control top toolbar.
 *   * InventoryList - to allow consumers to change data from outside and contains actual inventory table.
 *   * Pagination - bottom pagination.
 * It also calculates pagination and sortBy from props or from store if consumer passed items or not.
 */
const InventoryTable = forwardRef(({
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
    ...props
}, ref) => {
    const hasItems = Boolean(items);
    const page = useSelector(({ entities: { page: invPage } }) => (
        (hasItems && propsPage) || invPage || 1)
    , shallowEqual);
    const perPage = useSelector(({ entities: { perPage: invPerPage } }) => (
        (hasItems && propsPerPage) || invPerPage || 50)
    , shallowEqual);
    const total = useSelector(({ entities: { total: invTotal } }) => (
        (hasItems && (total || items?.length)) || invTotal)
    , shallowEqual);
    const pagination = {
        page,
        perPage,
        total
    };
    const sortBy = useSelector(({ entities: { sortBy: invSortBy } }) => (
        (hasItems && propsSortBy) || invSortBy
    ), shallowEqual);

    return (
        <Fragment>
            <EntityTableToolbar
                { ...props }
                items={ items }
                onRefresh={onRefresh}
                filters={ filters }
                hasItems={ hasItems }
                total={ pagination.total }
                page={ pagination.page }
                perPage={ pagination.perPage }
                showTags={ showTags }
            >
                { children }
            </EntityTableToolbar>
            <InventoryList
                { ...props }
                ref={ref}
                hasItems={ hasItems }
                onRefresh={ onRefresh }
                items={ items }
                page={ pagination.page }
                sortBy={ sortBy }
                perPage={ pagination.perPage }
                showTags={ showTags }
            />
            <TableToolbar isFooter className="ins-c-inventory__table--toolbar">
                <Pagination
                    isFull
                    items={ items }
                    total={ pagination.total }
                    page={ pagination.page }
                    perPage={ pagination.perPage }
                    hasItems={ hasItems }
                    onRefresh={ onRefresh }
                />
            </TableToolbar>
        </Fragment>
    );
});

export default InventoryTable;
