import React, { KeyboardEvent } from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { ButtonProps } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Pagination } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { PaginationProps } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { Toolbar } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarContent } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarExpandIconWrapper } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarGroup } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarItem } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import AngleDownIcon from '@patternfly/react-icons/dist/dynamic/icons/angle-down-icon';
import AngleRightIcon from '@patternfly/react-icons/dist/dynamic/icons/angle-right-icon';
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
  toggleIsExpanded?: () => void;
  /** @reference [BulkSelect props](/fec/modules/components/BulkSelect) */
  bulkSelect?: BulkSelectProps;
  /** @reference [ConditionalFilter props](/fec/modules/components/ConditionalFilter)*/
  filterConfig?: ConditionalFilterProps;
  dedicatedAction?: React.ReactNode;
  /** @reference [PF pagination props](https://www.patternfly.org/v4/components/pagination#pagination) */
  pagination?: Omit<PaginationProps, 'ref'>;

  /** @reference [SortBy props](/fec/modules/components/SortBy) */
  sortByConfig?: SortByProps;
  /** @reference [DownloadButton props](/fec/modules/components/DownloadButton) */
  exportConfig?: DownloadButtonProps;

  /** @reference [FilterChips props](/fec/modules/components/FilterChips) */
  activeFiltersConfig?: FilterChipsProps;
  actionsConfig?: ActionsProps;
  expandAll?: React.ReactNode | PrimaryToolbarExpandAllObject;

  /** Use PF [toolbar toggle component for conditional filter](https://www.patternfly.org/v4/components/toolbar/react/component-managed-toggle-groups/) */
  useMobileLayout?: boolean;
}

function isPrimaryToolbarExpandAllObject(node: React.ReactNode | PrimaryToolbarExpandAllObject): node is PrimaryToolbarExpandAllObject {
  return !React.isValidElement(node);
}

const PrimaryToolbar: React.FunctionComponent<React.PropsWithChildren<PrimaryToolbarProps>> = ({
  id,
  className,
  toggleIsExpanded = () => undefined,
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
  ...props
}) => {
  const overflowActions = [
    ...(sortByConfig
      ? [
          {
            label: 'Sort order ASC',
            props: { isDisabled: sortByConfig.direction === SortByDirection.asc },
            onClick: (e: MouseEvent | React.MouseEvent<any, MouseEvent> | KeyboardEvent<Element>) =>
              sortByConfig.onSortChange && sortByConfig.onSortChange(e, SortByDirection.asc),
          },
          {
            label: 'Sort order DESC',
            props: { isDisabled: sortByConfig.direction === SortByDirection.desc },
            onClick: (e: MouseEvent | React.MouseEvent<any, MouseEvent> | KeyboardEvent<Element>) =>
              sortByConfig.onSortChange && sortByConfig.onSortChange(e, SortByDirection.desc),
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
                    icon={<ToolbarExpandIconWrapper>{expandAll.isAllExpanded ? <AngleDownIcon /> : <AngleRightIcon />}</ToolbarExpandIconWrapper>}
                    {...expandAll.buttonProps}
                    variant="plain"
                    aria-label={`${expandAll.isAllExpanded ? 'Collapse' : 'Expand'} all`}
                    onClick={(e) => expandAll.onClick(e, !expandAll.isAllExpanded)}
                    ouiaId="ExpandCollapseAll"
                    isDisabled={expandAll.isDisabled}
                  />
                ) : (
                  expandAll
                )}
              </ToolbarItem>
            )}
            {bulkSelect && <ToolbarItem>{React.isValidElement(bulkSelect) ? bulkSelect : <BulkSelect {...bulkSelect} />}</ToolbarItem>}
            {filterConfig && (
              <ToolbarItem className="ins-c-primary-toolbar__filter">
                {React.isValidElement(filterConfig) ? filterConfig : <ConditionalFilter {...filterConfig} />}
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
