import React, { Component, Fragment } from 'react';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { entitiesLoading } from '../../redux/actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadSystems } from '../../shared';
import debounce from 'lodash/debounce';

/**
 * Bottom pagination used in table. It can remember what page user is on if user entered the page number in input.
 */
class FooterPagination extends Component {
    state = {
        page: undefined
    };
    changePage = debounce((pagination) => this.updatePagination(pagination), 800);

    /**
     * Actual function called when updating any part of pagination.
     * It either calls `onRefresh` from props if passed or dispatches new action `loadEntities`.
     * @param {*} pagination contains new pagination config.
     */
    updatePagination = (pagination) => {
        const { onRefresh, dataLoading, loadEntities, showTags } = this.props;
        if (onRefresh) {
            dataLoading();
            onRefresh(pagination, (options) => loadEntities(options, showTags));
        } else {
            loadEntities(pagination, showTags);
        }
    }

    /**
     * Thi method sets new page and combines previous props to apply sort, filters etc.
     * @param {*} event html event to figure if target was input.
     * @param {*} page current page to change to.
     */
    onSetPage = (event, page) => {
        const { perPage, filters, sortBy, hasItems, items } = this.props;
        // eslint-disable-next-line camelcase
        const pagination = { page, per_page: perPage, filters, sortBy, hasItems, items };
        if (event.target.matches('input')) {
            this.changePage(pagination);
            this.setState({
                page
            });
        } else {
            this.updatePagination(pagination);
            this.setState({
                page: undefined
            });
        }
    }

    /**
     * This method changes per page, it automatically sets page to first one.
     * It also applies previous sort, filters, etc.
     * @param {*} _event event is now not used.
     * @param {*} perPage new perPage set by user.
     */
    onPerPageSelect = (_event, perPage) => {
        const { filters, sortBy, hasItems, items } = this.props;
        this.setState({ page: 1 });
        // eslint-disable-next-line camelcase
        this.updatePagination({ page: 1, per_page: perPage, filters, sortBy, hasItems, items });
    }

    render() {
        const { total, page, perPage, loaded, direction, isFull, hasItems } = this.props;
        const { page: statePage } = this.state;
        const extra = isFull ? {
            variant: PaginationVariant.bottom
        } : {};

        return (
            <Fragment>
                { loaded && (
                    <Pagination
                        { ...extra }
                        itemCount={ total }
                        page={ hasItems ? page : statePage || page }
                        perPage={ perPage }
                        dropDirection={ direction }
                        onSetPage={ this.onSetPage }
                        onPerPageSelect={ this.onPerPageSelect }
                    />
                ) }
            </Fragment>
        );
    }
}

const propTypes = {
    perPage: PropTypes.number,
    total: PropTypes.number,
    loaded: PropTypes.bool,
    isFull: PropTypes.bool,
    onRefresh: PropTypes.func,
    direction: PropTypes.string
};

FooterPagination.propTypes = propTypes;

FooterPagination.defaultProps = {
    total: 0,
    loaded: false,
    isFull: false,
    direction: 'up'
};

function stateToProps(
    { entities: { loaded, activeFilters } },
    { hasItems, isFull, isLoaded }) {
    return {
        loaded: hasItems && isLoaded !== undefined ? (isLoaded && loaded) : loaded,
        filters: activeFilters,
        isFull
    };
}

function dispatchToProps(dispatch) {
    return {
        dataLoading: () => dispatch(entitiesLoading()),
        loadEntities: (config, showTags) => dispatch(loadSystems(config, showTags))
    };
}

export default connect(stateToProps, dispatchToProps)(FooterPagination);
