import { useState } from 'react';

export const usePaginate = ({ perPage = 10, itemCount } = {}) => {
    const [ paginationState, setPaginationState ] = useState({
        perPage: perPage,
        page: 1
    });
    const setPagination = (newState) => {
        setPaginationState({
            ...paginationState,
            ...newState
        });
    };

    const onSetPage = (_, page) => (
        setPagination({ ...paginationState, page })
    );

    const onPerPageSelect = (_, perPage) => (
        setPagination({ page: 1, perPage })
    );

    const paginator = (items) => {
        const { page, perPage } = paginationState;
        const start = (page - 1) * perPage;
        const end = start + perPage;

        return items.slice(start, end);
    };

    return {
        paginator,
        setPage: (page) => {
            setPaginationState({
                ...paginationState,
                page
            });
        },
        pagination: {
            ...paginationState,
            itemCount,
            onSetPage,
            onPerPageSelect
        }
    };
};

export default usePaginate;
