import React, { Component } from 'react';
import { PaginationRow } from 'patternfly-react';
import PropTypes from 'prop-types';

export const dropDirection = {
    up: 'up',
    down: 'down'
};

const pager = [ 10, 15, 20, 25, 50 ];

class Pagination extends Component {
    setPage = (page, debounce = false) => {
        const { page: currPage } = this.props;
        const perPage = this.props.itemsPerPage || pager[0];
        const maxPage = Math.ceil(this.props.numberOfItems / perPage);
        page = isNaN(page) ? currPage : page;
        page = page > maxPage ? maxPage : page < 0 ? 0 : page;
        this.props.hasOwnProperty('onSetPage') && this.props.onSetPage(page, debounce);
    }

    defaultFirstPage = () => {
        this.setPage(1);
    }

    defaultLastPage = () => {
        const perPage = this.props.itemsPerPage || pager[0];
        this.setPage(Math.ceil(this.props.numberOfItems / perPage));
    }

    defaultPreviousPage = () => {
        const { page = 1 } = this.props;
        this.setPage(page - 1);
    }

    defaultNextPage = () => {
        const { page = 1 } = this.props;
        this.setPage(page + 1);
    }

    render() {
        let { page } = this.props;
        const perPageOptions = this.props.perPageOptions || pager;
        const perPage = this.props.itemsPerPage || perPageOptions[0];
        const lastPage = Math.ceil(this.props.numberOfItems / perPage);
        let lastIndex = page === lastPage ? this.props.numberOfItems : page * perPage;
        let firstIndex = page === 1 ? 1 : page * perPage - perPage;
        if (this.props.numberOfItems === 0) {
            lastIndex = 0;
            firstIndex = 0;
        }

        return (
            <div className="special-patternfly" widget-type='InsightsPagination'>
                { typeof PaginationRow !== 'undefined' && <PaginationRow
                    { ...this.props }
                    pageInputValue={ this.props.page || 1 }
                    viewType={ this.props.viewType || 'table' }
                    pagination={ { perPage, page, perPageOptions } }
                    amountOfPages={ lastPage || 1 }
                    itemCount={ this.props.numberOfItems }
                    itemsStart={ firstIndex }
                    pageSizeDropUp={ this.props.direction === 'up' }
                    itemsEnd={ lastIndex }
                    onPerPageSelect={ this.props.onPerPageSelect }
                    onPageInput={ event => this.setPage(parseInt(event.target.value, 10), true) }
                    onFirstPage={ this.props.onFirstPage || this.defaultFirstPage }
                    onLastPage={ this.props.onLastPage || this.defaultLastPage }
                    onPreviousPage={ this.props.onPreviousPage || this.defaultPreviousPage }
                    onNextPage={ this.props.onNextPage || this.defaultNextPage }
                /> }
            </div>
        );
    }
}

Pagination.propTypes = {
    direction: PropTypes.oneOf(Object.keys(dropDirection)),
    viewType: PropTypes.string,
    itemsPerPage: PropTypes.number,
    perPageOptions: PropTypes.arrayOf(PropTypes.number),
    numberOfItems: PropTypes.number.isRequired,
    onSetPage: PropTypes.func,
    onPerPageSelect: PropTypes.func,
    onFirstPage: PropTypes.func,
    onLastPage: PropTypes.func,
    onPreviousPage: PropTypes.func,
    onNextPage: PropTypes.func
};

Pagination.defaultProps = {
    page: 1
};

export default Pagination;
