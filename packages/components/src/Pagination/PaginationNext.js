import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PaginationNav from './PaginationNav';
import PaginationMenu from './PaginationMenu';

class PaginationNext extends Component {
  render() {
    const {
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
    } = this.props;
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
  }
}

PaginationNext.propTypes = {
  amountOfPages: PropTypes.number,
  itemCount: PropTypes.number.isRequired,
  page: PropTypes.number,
  itemsStart: PropTypes.number,
  itemsEnd: PropTypes.number,
  widtgetId: PropTypes.string,
  dropDirection: PropTypes.string,
  onSetPerPage: PropTypes.func,
  perPage: PropTypes.number,
  perPageOptions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      value: PropTypes.number,
    })
  ),
  lastPage: PropTypes.number,
  setPage: PropTypes.func,
  onFirstPage: PropTypes.func,
  onLastPage: PropTypes.func,
  onPreviousPage: PropTypes.func,
  onNextPage: PropTypes.func,
  className: PropTypes.string,
};

export default PaginationNext;
