import React from 'react';
import {
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Pagination,
  Button,
  ToolbarExpandIconWrapper,
  PaginationProps,
  ButtonProps,
} from '@patternfly/react-core';
import { AngleDownIcon, AngleRightIcon } from '@patternfly/react-icons';
import { SortByDirection } from '@patternfly/react-table';

import Actions, { ActionsProps } from './Actions';
import { BulkSelect, BulkSelectProps } from '../BulkSelect';
import { ConditionalFilter, ConditionalFilterProps } from '../ConditionalFilter';
import { DownloadButtonProps } from '../DownloadButton';
import { FilterChips, FilterChipsProps } from '../FilterChips';
import SortBy, { SortByProps } from './SortBy';

import './primary-toolbar.scss';

export type PrimaryToolbarExpandAllObject = {
  onClick: (event: React.MouseEvent<Element, MouseEvent>, isExpanded: boolean) => void;
  isAllExpanded?: boolean;
  buttonProps?: ButtonProps;
  isDisabled?: boolean;
};

export interface PrimaryToolbarProps {
  id?: string | number;
  className?: string;
  toggleIsExpanded?: () => 'bla';
  /** @reference [BulkSelect props](/components/BulkSelect) */
  bulkSelect?: BulkSelectProps;
  /** @reference [ConditionalFilter props](/components/ConditionalFilter)
   * TODO: use ConditionalFilterProps: https://github.com/RedHatInsights/frontend-components/pull/1379
   */
  filterConfig?: ConditionalFilterProps;
  dedicatedAction?: React.ReactNode;
  /** @reference [PF pagination props](https://www.patternfly.org/v4/components/pagination#pagination) */
  pagination?: Omit<PaginationProps, 'ref'>;

  /** @reference [SortBy props](/components/SortBy) */
  sortByConfig?: SortByProps;
  /** @reference [DownloadButton props](/components/DownloadButton) */
  exportConfig?: DownloadButtonProps;

  /** @reference [FilterChips props](/components/FilterChips)
   */
  activeFiltersConfig?: FilterChipsProps;
  actionsConfig?: ActionsProps;
  expandAll?: React.ReactNode | PrimaryToolbarExpandAllObject;

  /** Use PF [toolbar toggle component for conditional filter](https://www.patternfly.org/v4/components/toolbar/react/component-managed-toggle-groups/) */
  useMobileLayout?: boolean;
}

function isPrimaryToolbarExpandAllObject(node: React.ReactNode | PrimaryToolbarExpandAllObject): node is PrimaryToolbarExpandAllObject {
  return !React.isValidElement(node);
}

const PrimaryToolbar: React.FunctionComponent<PrimaryToolbarProps> = ({
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
}) => {
  const overflowActions = [
    ...(sortByConfig
      ? [
          {
            label: 'Sort order ASC',
            props: { isDisabled: sortByConfig.direction === SortByDirection.asc },
            onClick: (e: React.MouseEvent) => sortByConfig.onSortChange && sortByConfig.onSortChange(e, SortByDirection.asc),
          },
          {
            label: 'Sort order DESC',
            props: { isDisabled: sortByConfig.direction === SortByDirection.desc },
            onClick: (e: React.MouseEvent) => sortByConfig.onSortChange && sortByConfig.onSortChange(e, SortByDirection.desc),
          },
        ]
      : []),
  ];
  return (
    <Toolbar
      {...props}
      className={`${className || ''} ins-c-primary-toolbar`}
      toggleIsExpanded={toggleIsExpanded}
      id={id ? `${id}` : 'ins-primary-data-toolbar'}
      ouiaId="PrimaryToolbar"
    >
      <ToolbarContent>
        {(expandAll || bulkSelect || filterConfig || dedicatedAction) && (
          <ToolbarGroup className="ins-c-primary-toolbar__group-filter pf-m-spacer-md pf-m-space-items-lg" variant="filter-group">
            {expandAll && (
              <ToolbarItem>
                {isPrimaryToolbarExpandAllObject(expandAll) ? (
                  <Button
                    {...expandAll.buttonProps}
                    variant="plain"
                    aria-label={`${expandAll.isAllExpanded ? 'Collapse' : 'Expand'} all`}
                    onClick={(e) => expandAll.onClick(e, !expandAll.isAllExpanded)}
                    ouiaId="ExpandCollapseAll"
                    isDisabled={expandAll.isDisabled}
                  >
                    <ToolbarExpandIconWrapper>{expandAll.isAllExpanded ? <AngleDownIcon /> : <AngleRightIcon />}</ToolbarExpandIconWrapper>
                  </Button>
                ) : (
                  expandAll
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
        typeof activeFiltersConfig?.filters !== 'undefined' &&
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
};

export default PrimaryToolbar;
