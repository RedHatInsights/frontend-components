import React, { Component } from 'react';
import PaginationNext from './PaginationNext';
import PropTypes from 'prop-types';

export const dropDirection = {
    up: 'up',
    down: 'down'
};

const pager = [ 10, 15, 20, 25, 50 ];

class Pagination extends Component {
    setPage = (page, debounce) => {
        const { page: currPage } = this.props;
        const perPage = this.props.itemsPerPage || pager[0];
        const maxPage = Math.ceil(this.props.numberOfItems / perPage);
        page = isNaN(page) ? currPage : page;
        page = page > maxPage ? maxPage : page < 0 ? 0 : page;
        this.props.hasOwnProperty('onSetPage') && this.props.onSetPage(page, debounce);
    }

    render() {
        let {
            page,
            onSetPage,
            numberOfItems,
            itemsPerPage,
            perPageOptions,
            onPerPageSelect,
            onFirstPage,
            onLastPage,
            onPreviousPage,
            onNextPage,
            ...props
        } = this.props;
        const pagerOptions = perPageOptions || pager;
        const perPage = itemsPerPage || pagerOptions[0];
        const lastPage = Math.ceil(numberOfItems / perPage);
        let lastIndex = numberOfItems === 0 ? 0 : page === lastPage ? numberOfItems : page * perPage;
        let firstIndex = numberOfItems === 0 ? 0 : (page - 1) * perPage + 1;

        return (
            <PaginationNext { ...props }
                itemCount={ this.props.numberOfItems }
                className="ins-c-pagination-next"
                itemsStart={ firstIndex }
                itemsEnd={ lastIndex }
                lastPage={ lastPage || 1 }
                dropDirection={ this.props.direction }
                onFirstPage={ onFirstPage }
                onLastPage={ onLastPage }
                onPreviousPage={ onPreviousPage }
                onNextPage={ onNextPage }
                perPage={ perPage }
                onSetPerPage={ (_event, value) => this.props.onPerPageSelect(value) }
                page={ this.props.page }
                setPage={ (event, page) => this.setPage(page, event.currentTarget.tagName === 'INPUT') }
                perPageOptions={ pagerOptions.map(value => ({
                    title: value,
                    value
                })) }
            />
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
    onNextPage: PropTypes.func,
    page: PropTypes.number
};

Pagination.defaultProps = {
    page: 1
};

export default Pagination;
