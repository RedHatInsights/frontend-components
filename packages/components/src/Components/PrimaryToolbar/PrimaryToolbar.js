import React, { Component } from 'react';
import { DataToolbar, DataToolbarItem, DataToolbarContent, DataToolbarGroup } from '@patternfly/react-core/dist/js/experimental';
import { Pagination } from '@patternfly/react-core';
import { ConditionalFilter } from '../ConditionalFilter';
import { BulkSelect } from '../BulkSelect';
import { DownloadButton } from '../DownloadButton';
import { FilterChips } from '../FilterChips';
import { SortByDirection } from '@patternfly/react-table';
import SortBy from './SortBy';
import Actions from './Actions';
import PropTypes from 'prop-types';

class PrimaryToolbar extends Component {
    render () {
        const {
            id,
            className,
            toggleIsExpanded,
            bulkSelect,
            filterConfig,
            actionsConfig,
            sortByConfig,
            pagination,
            activeFiltersConfig,
            children,
            exportConfig,
            ...props
        } = this.props;
        const overflowActions = [
            ...sortByConfig ?
                [
                    {
                        label: 'Sort order ASC',
                        props: { isDisabled: sortByConfig.direction === SortByDirection.asc },
                        onClick: (e) => sortByConfig.onSortChange &&
                            sortByConfig.onSortChange(e, SortByDirection.asc)
                    }, {
                        label: 'Sort order DESC',
                        props: { isDisabled: sortByConfig.direction === SortByDirection.desc },
                        onClick: (e) => sortByConfig.onSortChange &&
                            sortByConfig.onSortChange(e, SortByDirection.desc)
                    }
                ] : []
        ];
        return (
            <DataToolbar
                { ...props }
                className={ `${className || ''} ins-c-primary-toolbar` }
                toggleIsExpanded={ toggleIsExpanded }
                id={ id || 'ins-primary-data-toolbar' }
            >
                <DataToolbarContent>
                    {
                        (bulkSelect || filterConfig) &&
                        <DataToolbarGroup
                            className="ins-c-primary-toolbar__group-filter pf-m-spacer-lg pf-m-space-items-lg"
                            variant="filter-group"
                        >
                            {
                                bulkSelect &&
                                <DataToolbarItem>
                                    {
                                        React.isValidElement(bulkSelect) ?
                                            bulkSelect :
                                            <BulkSelect {...bulkSelect } />
                                    }
                                </DataToolbarItem>
                            }
                            {
                                filterConfig &&
                                <DataToolbarItem className="ins-c-primary-toolbar__filter">
                                    {
                                        React.isValidElement(filterConfig) ?
                                            filterConfig :
                                            <ConditionalFilter { ...filterConfig } />
                                    }
                                </DataToolbarItem>
                            }
                        </DataToolbarGroup>
                    }
                    {
                        (
                            (actionsConfig && actionsConfig.actions && actionsConfig.actions.length > 0) ||
                            sortByConfig ||
                            exportConfig
                        ) && (
                            React.isValidElement(actionsConfig) ?
                                actionsConfig :
                                <Actions
                                    {...actionsConfig || {}}
                                    exportConfig={ exportConfig }
                                    overflowActions={overflowActions}
                                />
                        )
                    }
                    {
                        sortByConfig &&
                        <DataToolbarItem className="ins-c-primary-toolbar__sort-by">
                            {
                                React.isValidElement(sortByConfig) ?
                                    sortByConfig :
                                    <SortBy  {...sortByConfig }/>
                            }
                        </DataToolbarItem>
                    }
                    { children }
                    {
                        pagination &&
                        <DataToolbarItem className="ins-c-primary-toolbar__pagination">
                            {
                                React.isValidElement(pagination) ?
                                    pagination :
                                    <Pagination isCompact {...pagination} />
                            }
                        </DataToolbarItem>
                    }
                </DataToolbarContent>
                {
                    activeFiltersConfig &&
                    <DataToolbarContent>
                        <DataToolbarItem>
                            {
                                React.isValidElement(activeFiltersConfig) ?
                                    activeFiltersConfig :
                                    <FilterChips { ...activeFiltersConfig } />
                            }
                        </DataToolbarItem>
                    </DataToolbarContent>
                }
            </DataToolbar>
        );
    }
}

PrimaryToolbar.propTypes = {
    id: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    className: PropTypes.string,
    toggleIsExpanded: PropTypes.func,
    bulkSelect: PropTypes.shape(BulkSelect.propTypes),
    filterConfig: PropTypes.shape(ConditionalFilter.propTypes),
    pagination: PropTypes.shape(Pagination.propTypes),
    sortByConfig: PropTypes.shape(SortBy.propTypes),
    exportConfig: PropTypes.shape(DownloadButton.propTypes),
    activeFiltersConfig: PropTypes.shape(FilterChips.propTypes),
    children: PropTypes.node,
    actionsConfig: PropTypes.shape({
        actions: Actions.propTypes.actions,
        dropdownProps: Actions.propTypes.dropdownProps,
        onSelect: Actions.propTypes.onSelect
    })
};

PrimaryToolbar.defaultProps = {
    toggleIsExpanded: Function
};

export default PrimaryToolbar;
