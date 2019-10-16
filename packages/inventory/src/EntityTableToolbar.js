/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Skeleton, SkeletonSize, PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import debounce from 'lodash/debounce';
import { InventoryContext } from './Inventory';

const TEXT_FILTER = 'hostname_or_id';

class ContextEntityTableToolbar extends Component {
    state = {
        textFilter: ''
    }

    debouncedRefresh = debounce((config) => {
        this.props.onRefreshData && this.props.onRefreshData(config);
    }, 800);

    onSetTextFilter = (value) => {
        const { page, perPage } = this.props;
        this.debouncedRefresh({
            page, perPage, filters: [{
                value: TEXT_FILTER,
                filter: value
            }]
        });
        this.setState({
            textFilter: value
        });
    }

    render() {
        const {
            total,
            page,
            onRefreshData,
            perPage,
            filters,
            hasItems,
            pathPrefix,
            apiBase,
            children,
            loaded,
            actionsConfig,
            ...props
        } = this.props;
        return (<PrimaryToolbar
            {...props}
            className="ins-c-inventory__table--toolbar"
            filterConfig={{
                items: [
                    ...!hasItems ? [{
                        label: 'Name',
                        value: 'name-filter',
                        filterValues: {
                            placeholder: 'Find system by name',
                            value: this.state.textFilter,
                            onChange: (_e, value) => this.onSetTextFilter(value)
                        }
                    }] : []
                ]
            }}
            actionsConfig={
                loaded ?
                    actionsConfig :
                    <Skeleton size={SkeletonSize.lg} />
            }
            pagination={loaded ? {
                page,
                itemCount: total,
                perPage,
                onSetPage: (_e, newPage) => onRefreshData({ page: newPage, perPage, filters }),
                // eslint-disable-next-line camelcase
                onPerPageSelect: (_e, newPerPage) => onRefreshData({ page: 1, per_page: newPerPage, filters })
            } : <Skeleton size={SkeletonSize.lg} />}
        >
            { children }
        </PrimaryToolbar>);
    }
}

const EntityTableToolbar = ({ ...props }) => (
    <InventoryContext.Consumer>
        {({ onRefreshData }) => (
            <ContextEntityTableToolbar {...props} onRefreshData={onRefreshData} />
        )}
    </InventoryContext.Consumer>
);

EntityTableToolbar.propTypes = {
    total: PropTypes.number,
    filters: PropTypes.array,
    hasItems: PropTypes.bool,
    pathPrefix: PropTypes.number,
    apiBase: PropTypes.string,
    page: PropTypes.number,
    perPage: PropTypes.number,
    children: PropTypes.node,
    pagination: PrimaryToolbar.propTypes.pagination,
    loaded: PropTypes.bool,
    actionsConfig: PrimaryToolbar.propTypes.actionsConfig
};

ContextEntityTableToolbar.propTypes = {
    ...EntityTableToolbar.propTypes,
    onRefreshData: PropTypes.func
};

function mapStateToProps(
    { entities: { page, perPage, total, loaded, activeFilters } },
    { totalItems, page: currPage, perPage: currPerPage, hasItems }) {
    return {
        page: hasItems ? currPage : page,
        perPage: hasItems ? currPerPage : perPage,
        total: hasItems ? totalItems : total,
        loaded,
        filters: activeFilters
    };
}

export default connect(mapStateToProps)(EntityTableToolbar);
