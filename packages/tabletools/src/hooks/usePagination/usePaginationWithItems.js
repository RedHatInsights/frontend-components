import usePagination from './usePagination';

const usePaginationWithItems = (options) => {
  const enablePagination = options?.pagination !== false;
  const paginate = usePagination(options);

  const paginator = (items) => {
    const { page, perPage } = paginate.pagination;
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return items.slice(start, end);
  };

  return enablePagination
    ? {
        ...paginate,
        paginator,
      }
    : {};
};

export default usePaginationWithItems;
