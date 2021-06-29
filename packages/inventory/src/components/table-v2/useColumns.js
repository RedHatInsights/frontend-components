import { useMemo, useRef } from 'react';

import { defaultColumns } from '../../redux/entities';

const useColumns = ({ columns: columnsProp, showTags, disableDefaultColumns, columnsCounter }) => {
    const columns = useRef([]);
    useMemo(() => {
        if (typeof columnsProp === 'function') {
            columns.current = columnsProp(defaultColumns);
        } else if (columnsProp) {
            columns.current = columnsProp;
        } else {
            const disabledColumns = Array.isArray(disableDefaultColumns) ? disableDefaultColumns : [];
            const defaultColumnsFiltered = defaultColumns.filter(({ key }) =>
                (key === 'tags' && showTags) || (key !== 'tags' && !disabledColumns.includes(key))
            );
            columns.current = defaultColumnsFiltered;
        }
    }, [
        showTags,
        Array.isArray(disableDefaultColumns) ? disableDefaultColumns.join() : disableDefaultColumns,
        Array.isArray(columnsProp) ? columnsProp.map(({ key }) => key).join() : typeof columnsProp === 'function' ? 'function' : columnsProp,
        columnsCounter
    ]);

    return columns;
};

export default useColumns;
