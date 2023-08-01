import React from 'react';
import PaginationNav, { PaginationNavProps } from './PaginationNav';
import PaginationMenu, { PageOption, PaginationMenuProps } from './PaginationMenu';
import { DropdownDirection } from '@patternfly/react-core/deprecated';

export interface PaginationNextProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  amountOfPages?: number;
  itemCount: number;
  page?: number;
  itemsStart?: number;
  itemsEnd?: number;
  widtgetId?: string;
  dropDirection?: DropdownDirection;
  onSetPerPage: PaginationMenuProps['onSetPerPage'];
  perPage?: number;
  perPageOptions?: PageOption[];
  lastPage?: number;
  setPage: PaginationNavProps['setPage'];
  onFirstPage?: PaginationNavProps['onFirstPage'];
  onLastPage?: PaginationNavProps['onLastPage'];
  onPreviousPage?: PaginationNavProps['onPreviousPage'];
  onNextPage?: PaginationNavProps['onNextPage'];
  className?: string;
}

const PaginationNext: React.FunctionComponent<PaginationNextProps> = ({
  className,
  page,
  lastPage,
  setPage,
  itemsStart,
  itemsEnd,
  widtgetId,
  onSetPerPage,
  itemCount,
  perPageOptions,
  dropDirection,
  amountOfPages,
  onFirstPage,
  onLastPage,
  onPreviousPage,
  onNextPage,
  perPage,
  ...props
}) => {
  return (
    <div className={`pf-c-pagination pf-m-footer ${className}`} aria-label="Element pagination" {...props}>
      <PaginationMenu
        itemsStart={itemsStart}
        itemsEnd={itemsEnd}
        widtgetId={widtgetId}
        dropDirection={dropDirection}
        onSetPerPage={onSetPerPage}
        itemCount={itemCount}
        perPage={perPage}
        perPageOptions={perPageOptions}
      />
      <PaginationNav
        lastPage={lastPage}
        page={page}
        setPage={setPage}
        onFirstPage={onFirstPage}
        onLastPage={onLastPage}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
      />
    </div>
  );
};

export default PaginationNext;
