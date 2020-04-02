import React, { Component, Fragment } from 'react';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { entitiesLoading } from './redux/actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { InventoryContext } from './Inventory';
import debounce from 'lodash/debounce';

class ContextFooterPagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: undefined
        };

        this.changePage = debounce((pagination) => this.updatePagination(pagination), 800);
    }

    updatePagination = (pagination) => {
        const { onRefreshData, onRefresh, dataLoading } = this.props;
        if (onRefresh) {
            dataLoading();
            onRefresh(pagination);
        } else {
            onRefreshData(pagination);
        }
    }

    onSetPage = (event, page) => {
        const { perPage, filters } = this.props;
        // eslint-disable-next-line camelcase
        const pagination = { page, per_page: perPage, filters };
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

    onPerPageSelect = (_event, perPage) => {
        const { filters } = this.props;
        this.setState({ page: 1 });
        // eslint-disable-next-line camelcase
        this.updatePagination({ page: 1, per_page: perPage, filters });
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

const FooterPagination = ({ ...props }) => (
    <InventoryContext.Consumer>
        { ({ onRefreshData }) => (
            <ContextFooterPagination { ...props } onRefreshData={ onRefreshData } />
        ) }
    </InventoryContext.Consumer>
);

const propTypes = {
    perPage: PropTypes.number,
    total: PropTypes.number,
    loaded: PropTypes.bool,
    isFull: PropTypes.bool,
    onRefresh: PropTypes.func,
    direction: PropTypes.string
};

ContextFooterPagination.propTypes = {
    ...propTypes,
    onRefreshData: PropTypes.func
};

FooterPagination.propTypes = propTypes;

FooterPagination.defaultProps = {
    total: 0,
    loaded: false,
    isFull: false,
    direction: 'up',
    onRefreshData: () => undefined
};

function stateToProps(
    { entities: { page, perPage, total, loaded, activeFilters } },
    { totalItems, page: currPage, perPage: currPerPage, hasItems, isFull }) {
    return {
        page: hasItems ? currPage : page,
        perPage: hasItems ? currPerPage : perPage,
        total: hasItems ? totalItems : total,
        loaded,
        filters: activeFilters,
        isFull
    };
}

function dispatchToProps(dispatch) {
    return {
        dataLoading: () => dispatch(entitiesLoading())
    };
}

export default connect(stateToProps, dispatchToProps)(FooterPagination);
