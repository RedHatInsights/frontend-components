import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import EntityTableToolbar from './EntityTableToolbar';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/esm/TableToolbar';
import InventoryList from './InventoryList';
import Pagination from './Pagination';

const InventoryTable = React.forwardRef(({
    onRefresh,
    children,
    inventoryRef,
    ...props
}, ref) => {
    let pagination = {
        page: useSelector(({ entities: { page, invConfig } }) => (
            (invConfig?.items && invConfig?.page) || page || 1)
        ),
        perPage: useSelector(({ entities: { perPage, invConfig } }) => (
            (invConfig?.items && invConfig?.perPage) || perPage || 50)
        ),
        total: useSelector(({ entities: { total, invConfig } }) => (
            (invConfig?.items && (invConfig?.total || invConfig.items.length)) || total)
        )
    };

    const hasItems = useSelector(({ entities: { invConfig } }) => Boolean(invConfig?.items));
    const sortBy = useSelector(({ entities: { sortBy, invConfig } }) => (
        (invConfig?.items && invConfig?.sortBy) || sortBy
    ));
    const filters = useSelector(({ entities: { invConfig: { filters } } }) => filters);
    const showTags = useSelector(({ entities: { invConfig: { showTags } } }) => showTags);
    const items = useSelector(({ entities: { invConfig: { items } } }) => items);

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
