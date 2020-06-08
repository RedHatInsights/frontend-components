import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { InventoryContext } from '../../shared';
import EntityTableToolbar from './EntityTableToolbar';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/esm/TableToolbar';
import InventoryList from './InventoryList';
import Pagination from './Pagination';

const InventoryTable = ({
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
    ...props
}) => {
    const [ onRefreshData, setOnRefreshData ] = useState(() => undefined);
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
        <InventoryContext.Provider value={ {
            onRefreshData,
            setRefresh: (onRefresh) => setOnRefreshData(() => onRefresh)
        } }>
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
        </InventoryContext.Provider>
    );
};

export default InventoryTable;
