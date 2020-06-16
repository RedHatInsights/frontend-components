import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { InventoryContext } from '../../shared';
import EntityTableToolbar from './EntityTableToolbar';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/esm/TableToolbar';
import InventoryList from './InventoryList';
import Pagination from './Pagination';

const ContextInventoryTable = React.forwardRef(({
    items,
    filters,
    showHealth,
    onRefresh,
    page,
    perPage,
    total,
    children,
    showTags,
    sortBy,
    inventoryRef,
    ...props
}, ref) => {
    let pagination = {
        page,
        perPage,
        total: total || (items && items.length)
    };

    if (!items) {
        pagination.page = useSelector(({ entities: { page } }) => page);
        pagination.perPage = useSelector(({ entities: { perPage } }) => perPage);
        pagination.total = useSelector(({ entities: { total } }) => total);
    }

    return (
        <Fragment>
            <EntityTableToolbar
                { ...props }
                onRefresh={onRefresh}
                filters={ filters }
                hasItems={ Boolean(items) }
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
                hasItems={ Boolean(items) }
                onRefresh={ onRefresh }
                items={ items }
                page={ pagination.page }
                sortBy={ items ? sortBy : useSelector(({ entities: { sortBy } }) => sortBy) }
                perPage={ pagination.perPage }
                showHealth={ showHealth }
                showTags={ showTags }
            />
            <TableToolbar isFooter className="ins-c-inventory__table--toolbar">
                <Pagination
                    isFull
                    total={ pagination.total }
                    page={ pagination.page }
                    perPage={ pagination.perPage }
                    hasItems={ Boolean(items) }
                    onRefresh={ onRefresh }
                />
            </TableToolbar>
        </Fragment>
    );
});

const InventoryTable = React.forwardRef((props, ref) => (
    <InventoryContext.Consumer>
        {(context) => <ContextInventoryTable {...props} {...context} ref={ref} />}
    </InventoryContext.Consumer>
));

export default InventoryTable;
