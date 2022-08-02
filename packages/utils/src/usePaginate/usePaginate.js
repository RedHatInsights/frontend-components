import { useCallback, useState } from 'react';

/**
 * Provides `pagination` props and functionality for a (Primary)Toolbar
 *
 * @param {Object} [options]
 */
const usePaginate = (options = {}) => {
  const { perPage = 10 } = options;
  const enablePagination = options?.pagination !== false;

  const [paginationState, setPaginationState] = useState({
    perPage,
    page: 1,
  });
  const setPagination = useCallback(
    (newState) =>
      setPaginationState({
        ...paginationState,
        ...newState,
      }),
    [setPaginationState]
  );

  const setPage = (page) => {
    const nextPage = page < 0 ? paginationState.page + page : page;
    setPagination({
      page: nextPage > 0 ? nextPage : 1,
    });
  };

  return enablePagination
    ? {
        pagination: paginationState,
        setPage,
        toolbarProps: {
          pagination: {
            ...paginationState,
            onSetPage: (_, page) => setPagination({ ...paginationState, page }),
            onPerPageSelect: (_, perPage) => setPagination({ page: 1, perPage }),
          },
        },
      }
    : {};
};

export default usePaginate;
