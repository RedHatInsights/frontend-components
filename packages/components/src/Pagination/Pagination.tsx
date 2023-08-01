import React from 'react';
import PaginationNext, { PaginationNextProps } from './PaginationNext';
import { DropdownDirection } from '@patternfly/react-core/deprecated';

export const dropDirection = {
  up: 'up',
  down: 'down',
};

const pager = [10, 15, 20, 25, 50];

export interface PaginationProps extends Omit<PaginationNextProps, 'perPageOptions'> {
  direction?: DropdownDirection;
  viewType?: string;
  itemsPerPage?: number;
  perPageOptions?: number[];
  numberOfItems: number;
  onSetPage?: (nextPage: number, debounce?: boolean) => void;
  onPerPageSelect: (value: number) => void;
  onFirstPage?: () => void;
  onLastPage?: () => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  page?: number;
}

const Pagination: React.FunctionComponent<PaginationProps> = ({
  page = 1,
  onSetPage,
  numberOfItems,
  itemsPerPage,
  perPageOptions,
  onPerPageSelect,
  onFirstPage,
  onLastPage,
  onPreviousPage,
  onNextPage,
  direction,
  ...props
}) => {
  const setPage = (nextPage: number, debounce: boolean) => {
    const perPage = itemsPerPage || pager[0];
    const maxPage = Math.ceil(numberOfItems / perPage);
    let result = isNaN(nextPage) ? page : nextPage;
    result = result > maxPage ? maxPage : result < 0 ? 0 : result;
    onSetPage && onSetPage(result, debounce);
  };
  const pagerOptions = perPageOptions || pager;
  const perPage: number = itemsPerPage || pagerOptions[0];
  const lastPage = Math.ceil(numberOfItems / perPage);
  const lastIndex = numberOfItems === 0 ? 0 : page === lastPage ? numberOfItems : page * perPage;
  const firstIndex = numberOfItems === 0 ? 0 : (page - 1) * perPage + 1;

  return (
    <PaginationNext
      {...props}
      itemCount={numberOfItems}
      className="ins-c-pagination-next"
      itemsStart={firstIndex}
      itemsEnd={lastIndex}
      lastPage={lastPage || 1}
      dropDirection={direction}
      onFirstPage={onFirstPage}
      onLastPage={onLastPage}
      onPreviousPage={onPreviousPage}
      onNextPage={onNextPage}
      perPage={perPage}
      onSetPerPage={(_event, value) => onPerPageSelect(value)}
      page={page}
      setPage={(event, page) => setPage(page, event.currentTarget.tagName === 'INPUT')}
      perPageOptions={pagerOptions.map((value) => ({
        title: value,
        value,
      }))}
    />
  );
};

export default Pagination;
