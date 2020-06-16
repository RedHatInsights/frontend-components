import React, { Component, Fragment } from 'react';
import { Pagination, PaginationVariant } from '@patternfly/react-core/dist/esm/components/Pagination';
import { entitiesLoading } from '../../redux/actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadSystems } from '../../shared';
import debounce from 'lodash/debounce';

class FooterPagination extends Component {
    state = {
        page: undefined
    };
    changePage = debounce((pagination) => this.updatePagination(pagination), 800);

    updatePagination = (pagination) => {
        const { onRefresh, dataLoading, loadEntities, showTags } = this.props;
        if (onRefresh) {
            dataLoading();
            onRefresh(pagination, (options) => loadEntities(options, showTags));
        } else {
            loadEntities(pagination, showTags);
        }
    }

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
