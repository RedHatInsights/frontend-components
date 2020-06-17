import React, { Fragment, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import EntityTableToolbar from './EntityTableToolbar';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/esm/TableToolbar';
import InventoryList from './InventoryList';
import Pagination from './Pagination';

const InventoryTable = forwardRef(({
    onRefresh,
    children,
    inventoryRef,
    items,
    total,
    page,
    perPage,
    filters,
    showTags,
    sortBy: propsSortBy,
    ...props
}, ref) => {
    console.log(React, 'Inventory react');
    return <div>aaaa</div>;
    // const hasItems = Boolean(items);
    // let pagination = {
    //     page: useSelector(({ entities: { page: invPage } }) => (
    //         (hasItems && page) || invPage || 1)
    //     ),
    //     perPage: useSelector(({ entities: { perPage: invPerPage } }) => (
    //         (hasItems && perPage) || invPerPage || 50)
    //     ),
    //     total: useSelector(({ entities: { total: invTotal } }) => (
    //         (hasItems && (total || items?.length)) || invTotal)
    //     )
    // };
    // const sortBy = useSelector(({ entities: { sortBy: invSortBy } }) => (
    //     (hasItems && propsSortBy) || invSortBy
    // ));

    // return (
    //     <Fragment>
    //         <EntityTableToolbar
    //             { ...props }
    //             items={ items }
    //             onRefresh={onRefresh}
    //             filters={ filters }
    //             hasItems={ hasItems }
    //             total={ pagination.total }
    //             page={ pagination.page }
    //             perPage={ pagination.perPage }
    //             showTags={ showTags }
    //         >
    //             { children }
    //         </EntityTableToolbar>
    //         <InventoryList
    //             { ...props }
    //             ref={ref}
    //             hasItems={ hasItems }
    //             onRefresh={ onRefresh }
    //             items={ items }
    //             page={ pagination.page }
    //             sortBy={ sortBy }
    //             perPage={ pagination.perPage }
    //             showTags={ showTags }
    //         />
    //         <TableToolbar isFooter className="ins-c-inventory__table--toolbar">
    //             <Pagination
    //                 isFull
    //                 items={ items }
    //                 total={ pagination.total }
    //                 page={ pagination.page }
    //                 perPage={ pagination.perPage }
    //                 hasItems={ hasItems }
    //                 onRefresh={ onRefresh }
    //             />
    //         </TableToolbar>
    //     </Fragment>
    // );
});

export default InventoryTable;
