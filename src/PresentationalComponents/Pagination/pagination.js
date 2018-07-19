import React, { Component } from 'react';
import { PaginationRow } from 'patternfly-react';
import PropTypes from 'prop-types';

export const dropDirection = {
  up: 'up',
  down: 'down'
}

const pager = [10, 15, 20, 25, 50];

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.defaultFirstPage = this.defaultFirstPage.bind(this);
    this.defaultLastPage = this.defaultLastPage.bind(this);
    this.defaultPreviousPage = this.defaultPreviousPage.bind(this);
    this.defaultNextPage = this.defaultNextPage.bind(this);
    this.setPage = this.setPage.bind(this);
  }

  setPage(page) {
    this.props.hasOwnProperty('onSetPage') ? this.props.onSetPage(page) : console.log(page);
  }

  defaultFirstPage() {
    this.setPage(1)
  }

  defaultLastPage() {
    const perPage = this.props.itemsPerPage || pager[0];
    this.setPage(Math.ceil(this.props.numberOfItems / perPage))
  }

  defaultPreviousPage() {
    const { page = 1 } = this.props;
    this.setPage(page - 1)
  }

  defaultNextPage() {
    const { page = 1 } = this.props;
    this.setPage(page + 1)
  }

  render() {
    const { page = 1 } = this.props;
    const perPage = this.props.itemsPerPage || pager[0];
    const lastIndex = page * perPage;
    const perPageOptions = this.props.perPageOptions || pager;
    return (
      <div className="special-patternfly">
        <PaginationRow
          {...this.props}
          pageInputValue={this.props.page || 1}
          viewType={this.props.viewType || 'table'}
          pagination={{ perPage, page, perPageOptions }}
          amountOfPages={Math.ceil(this.props.numberOfItems / perPage)}
          itemCount={this.props.numberOfItems}
          itemsStart={lastIndex - perPage + 1}
          pageSizeDropUp={this.props.direction === 'up'}
          itemsEnd={lastIndex}
          onFirstPage={this.props.onFirstPage || this.defaultFirstPage}
          onLastPage={this.props.onLastPage || this.defaultLastPage}
          onPreviousPage={this.props.onPreviousPage || this.defaultPreviousPage}
          onNextPage={this.props.onNextPage || this.defaultNextPage}
          />
      </div>
    )
  }
}

Pagination.propTypes = {
  direction: PropTypes.oneOf(Object.keys(dropDirection)),
  viewType: PropTypes.string,
  itemsPerPage: PropTypes.number,
  perPageOptions: PropTypes.arrayOf(PropTypes.number),
  numberOfItems: PropTypes.number.isRequired,
  setPage: PropTypes.func
}

export default Pagination;