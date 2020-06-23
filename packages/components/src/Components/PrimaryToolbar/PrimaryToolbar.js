import { Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem, Pagination } from '@patternfly/react-core';
import React, { Component } from 'react';

import Actions from './Actions';
import { BulkSelect } from '../BulkSelect';
import { ConditionalFilter } from '../ConditionalFilter';
import { DownloadButton } from '../DownloadButton';
import { FilterChips } from '../FilterChips';
import PropTypes from 'prop-types';
import SortBy from './SortBy';
import { SortByDirection } from '@patternfly/react-table';

class PrimaryToolbar extends Component {
    render() {
        const {
            id,
            className,
            toggleIsExpanded,
            bulkSelect,
            filterConfig,
            dedicatedAction,
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
            <Toolbar
                {...props}
                className={`${className || ''} ins-c-primary-toolbar`}
                toggleIsExpanded={toggleIsExpanded}
                id={id || 'ins-primary-data-toolbar'}
            >
                <ToolbarContent>
                    {
                        (bulkSelect || filterConfig || dedicatedAction) &&
                        <ToolbarGroup
                            className="ins-c-primary-toolbar__group-filter pf-m-spacer-lg pf-m-space-items-lg"
                            variant="filter-group"
                        >
                            {
                                bulkSelect &&
                                <ToolbarItem>
                                    {
                                        React.isValidElement(bulkSelect) ?
                                            bulkSelect :
                                            <BulkSelect {...bulkSelect} />
                                    }
                                </ToolbarItem>
                            }
                            {
                                filterConfig &&
                                <ToolbarItem className="ins-c-primary-toolbar__filter">
                                    {
                                        React.isValidElement(filterConfig) ?
                                            filterConfig :
                                            <ConditionalFilter {...filterConfig} />
                                    }
                                </ToolbarItem>
                            }
                            {
                                dedicatedAction &&
                                <ToolbarItem>
                                    {dedicatedAction}
                                </ToolbarItem>
                            }
                        </ToolbarGroup>
                    }
                    {
                        React.isValidElement(actionsConfig) ? actionsConfig :
                            (
                                (actionsConfig && actionsConfig.actions && actionsConfig.actions.length > 0) ||
                                sortByConfig ||
                                exportConfig
                            ) && (
                                <Actions
                                    {...actionsConfig || {}}
                                    exportConfig={exportConfig}
                                    overflowActions={overflowActions}
                                />
                            )
                    }
                    {
                        sortByConfig &&
                        <ToolbarItem className="ins-c-primary-toolbar__sort-by">
                            {
                                React.isValidElement(sortByConfig) ?
                                    sortByConfig :
                                    <SortBy  {...sortByConfig} />
                            }
                        </ToolbarItem>
                    }
                    {children}
                    {
                        pagination &&
                        <ToolbarItem className="ins-c-primary-toolbar__pagination">
                            {
                                React.isValidElement(pagination) ?
                                    pagination :
                                    <Pagination isCompact {...pagination} />
                            }
                        </ToolbarItem>
                    }
                </ToolbarContent>
                {
                    activeFiltersConfig &&
                        React.isValidElement(activeFiltersConfig) ?
                        <ToolbarContent>
                            <ToolbarItem>{activeFiltersConfig}</ToolbarItem>
                        </ToolbarContent>
                        : activeFiltersConfig !== undefined && activeFiltersConfig.filters.length > 0 &&
                        <ToolbarContent>
                            <ToolbarItem><FilterChips {...activeFiltersConfig} /></ToolbarItem>
                        </ToolbarContent>
                }
            </Toolbar>
        );
    }
}

PrimaryToolbar.propTypes = {
    id: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    className: PropTypes.string,
    toggleIsExpanded: PropTypes.func,
    bulkSelect: PropTypes.shape(BulkSelect.propTypes),
    filterConfig: PropTypes.shape(ConditionalFilter.propTypes),
    dedicatedAction: PropTypes.node,
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
