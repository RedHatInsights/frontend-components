import { emptyRows } from './NoResultsTable';

const columnProp = (column) => {
    return column.key || column.original?.toLowerCase() || column.title?.toLowerCase();
};

const itemRow = (item, columns) => ({
    ...item.rowProps,
    itemId: item.itemId,
    cells: columns.map((column) => ({
        title: column.renderFunc ? column.renderFunc(item) : item[columnProp(column)]
    }))
});

const primeItem = (item, transformers) => {
    let newItem = item;

    transformers.forEach((transformer) => {
        if (transformer) {
            newItem = transformer(newItem);
        }
    });

    return newItem;
};

const applyTransformers = (items, transformers = []) => (
    items.map((item) => (
        primeItem(item, transformers)
    ))
);

const buildRows = (items, columns, options) => {
    const EmptyRowsComponent = options.emptyRows || emptyRows;
    const transformedItems = options?.transformers ?
        applyTransformers(items, options?.transformers) : items;

    const filteredItems = options?.filter ?
        options.filter(transformedItems) : items;

    const sortedItems = options?.sorter ?
        options.sorter(filteredItems) : filteredItems;

    const paginatedItems = options?.paginate?.paginator ?
        options?.paginate?.paginator(sortedItems) : sortedItems;

    const rows = paginatedItems.length > 0 ? paginatedItems.map((item) => (
        itemRow(item, columns)
    )).filter((v) => (!!v)) : EmptyRowsComponent;

    const pagination = options?.paginate?.pagination ? {
        ...options.paginate.pagination,
        itemCount: filteredItems.length
    } : undefined ;

    return {
        rows,
        pagination
    };
};

const useRowsBuilder = (columns, options) => (
    (items) => (
        buildRows(items, columns, options)
    )
);

export default useRowsBuilder;
