import { Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem, Pagination, Button, ToolbarExpandIconWrapper } from '@patternfly/react-core';
import { AngleDownIcon, AngleRightIcon } from '@patternfly/react-icons';
import React, { Component } from 'react';

import Actions from './Actions';
import { BulkSelect } from '../BulkSelect';
import { ConditionalFilter } from '../ConditionalFilter';
import { DownloadButton } from '../DownloadButton';
import { FilterChips } from '../FilterChips';
import PropTypes from 'prop-types';
import SortBy from './SortBy';
import { SortByDirection } from '@patternfly/react-table';
import './primary-toolbar.scss';

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
      expandAll,
      useMobileLayout,
      ...props
    } = this.props;
    const overflowActions = [
      ...(sortByConfig
        ? [
            {
              label: 'Sort order ASC',
              props: { isDisabled: sortByConfig.direction === SortByDirection.asc },
              onClick: (e) => sortByConfig.onSortChange && sortByConfig.onSortChange(e, SortByDirection.asc),
            },
            {
              label: 'Sort order DESC',
              props: { isDisabled: sortByConfig.direction === SortByDirection.desc },
              onClick: (e) => sortByConfig.onSortChange && sortByConfig.onSortChange(e, SortByDirection.desc),
            },
          ]
        : []),
    ];
    return (
      <Toolbar
        {...props}
        className={`${className || ''} ins-c-primary-toolbar`}
        toggleIsExpanded={toggleIsExpanded}
        id={id || 'ins-primary-data-toolbar'}
        ouiaId="PrimaryToolbar"
      >
        <ToolbarContent>
          {(expandAll || bulkSelect || filterConfig || dedicatedAction) && (
            <ToolbarGroup className="ins-c-primary-toolbar__group-filter pf-m-spacer-md pf-m-space-items-lg" variant="filter-group">
              {expandAll && (
                <ToolbarItem>
                  {React.isValidElement(expandAll) ? (
                    expandAll
                  ) : (
                    <Button
                      variant="plain"
                      aria-label={`${expandAll.isAllExpanded ? 'Collapse' : 'Expand'} all`}
                      onClick={(e) => expandAll.onClick(e, !expandAll.isAllExpanded)}
                      ouiaId="ExpandCollapseAll"
                    >
                      <ToolbarExpandIconWrapper>{expandAll.isAllExpanded ? <AngleDownIcon /> : <AngleRightIcon />}</ToolbarExpandIconWrapper>
                    </Button>
                  )}
                </ToolbarItem>
              )}
              {bulkSelect && (
                <ToolbarItem>{React.isValidElement(bulkSelect) ? bulkSelect : <BulkSelect ouiaId="BulkSelect" {...bulkSelect} />}</ToolbarItem>
              )}
              {filterConfig && (
                <ToolbarItem className="ins-c-primary-toolbar__filter">
                  {React.isValidElement(filterConfig) ? filterConfig : <ConditionalFilter useMobileLayout={useMobileLayout} {...filterConfig} />}
                </ToolbarItem>
              )}
              {dedicatedAction && <ToolbarItem>{dedicatedAction}</ToolbarItem>}
            </ToolbarGroup>
          )}
          {React.isValidElement(actionsConfig)
            ? actionsConfig
            : ((actionsConfig && actionsConfig.actions && actionsConfig.actions.length > 0) || sortByConfig || exportConfig) && (
                <Actions {...(actionsConfig || {})} exportConfig={exportConfig} overflowActions={overflowActions} />
              )}
          {sortByConfig && (
            <ToolbarItem className="ins-c-primary-toolbar__sort-by">
              {React.isValidElement(sortByConfig) ? sortByConfig : <SortBy {...sortByConfig} />}
            </ToolbarItem>
          )}
          {children}
          {pagination && (
            <ToolbarItem className="ins-c-primary-toolbar__pagination">
              {React.isValidElement(pagination) ? pagination : <Pagination isCompact ouiaId="CompactPagination" {...pagination} />}
            </ToolbarItem>
          )}
        </ToolbarContent>
        {activeFiltersConfig && React.isValidElement(activeFiltersConfig) ? (
          <ToolbarContent>
            <ToolbarItem>{activeFiltersConfig}</ToolbarItem>
          </ToolbarContent>
        ) : (
          activeFiltersConfig !== undefined &&
          (activeFiltersConfig.filters.length > 0 || activeFiltersConfig.showDeleteButton === true) && (
            <ToolbarContent>
              <ToolbarItem>
                <FilterChips {...activeFiltersConfig} />
              </ToolbarItem>
            </ToolbarContent>
          )
        )}
      </Toolbar>
    );
  }
}

PrimaryToolbar.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  toggleIsExpanded: PropTypes.func,
  /** @reference [BulkSelect props](/components/BulkSelect) */
  bulkSelect: PropTypes.shape(BulkSelect.propTypes),
  /** @reference [ConditionalFilter props](/components/ConditionalFilter) */
  filterConfig: PropTypes.shape(ConditionalFilter.propTypes),
  dedicatedAction: PropTypes.node,
  /** @reference [PF pagination props](https://www.patternfly.org/v4/components/pagination#pagination) */
  pagination: PropTypes.shape(Pagination.propTypes),
  /** @reference [SortBy props](/components/SortBy) */
  sortByConfig: PropTypes.shape(SortBy.propTypes),
  /** @reference [DownloadButton props](/components/DownloadButton) */
  exportConfig: PropTypes.shape(DownloadButton.propTypes),
  /** @reference [FilterChips props](/components/FilterChips) */
  activeFiltersConfig: PropTypes.shape(FilterChips.propTypes),
  children: PropTypes.node,
  actionsConfig: PropTypes.shape({
    actions: Actions.propTypes.actions,
    dropdownProps: Actions.propTypes.dropdownProps,
    onSelect: Actions.propTypes.onSelect,
  }),
  expandAll: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.shape({
      onClick: PropTypes.func,
      isAllExpanded: PropTypes.bool,
    }),
  ]),
  /** Use PF [toolbar toggle component for conditional filter](https://www.patternfly.org/v4/components/toolbar/react/component-managed-toggle-groups/) */
  useMobileLayout: PropTypes.bool,
};

export default PrimaryToolbar;
