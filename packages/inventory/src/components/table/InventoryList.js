/* eslint-disable react/display-name */
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import InventoryEntityTable from './EntityTable';
import { Grid, GridItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import './InventoryList.scss';
import isEqual from 'lodash/isEqual';
import AccessDenied from '../../shared/AccessDenied';

const convertItem = ({ children, isOpen, ...item }) => item;

/**
 * Component that works as a side channel for consumers to notify inventory of new data changes.
 */
const ContextInventoryList = ({ showHealth, onRefreshData, ignoreRefresh, ...props }) => {
  const prevItems = useRef(props.items);
  const prevSortBy = useRef(props.sortBy);

  useEffect(() => {
    if (props.hasItems) {
      onRefreshData({}, ignoreRefresh);
    }
  }, []);

  /**
   * Function to calculate for new changes, this function limits re-renders by checking if previous items are
   * same as new items.
   * If items are not passed, it only checks for props sortBy.
   * @param {*} prevProps previous props - items, hasItems, sortBy.
   */
  useEffect(() => {
    if (props.hasItems && !isEqual(prevItems.current.map(convertItem), props.items.map(convertItem))) {
      prevItems.current = props.items;
      onRefreshData({}, ignoreRefresh);
    }

    if (!props.hasItems && !isEqual(prevSortBy.current, props.sortBy)) {
      prevSortBy.current = props.sortBy;
      onRefreshData({}, ignoreRefresh);
    }
  });

  return (
    <Grid gutter="sm" className="ins-inventory-list">
      <GridItem span={12}>
        <InventoryEntityTable {...props} onRefreshData={onRefreshData} />
      </GridItem>
    </Grid>
  );
};

/**
 * Component that consumes active filters and passes them down to component.
 */
const InventoryList = React.forwardRef(({ hasAccess, onRefreshData, ...props }, ref) => {
  const activeFilters = useSelector(({ entities: { activeFilters } }) => activeFilters);

  if (ref) {
    ref.current = {
      onRefreshData: (params, disableRefresh = true) => onRefreshData(params, disableRefresh),
    };
  }

  return !hasAccess ? (
    <div className="ins-c-inventory__no-access">
      <AccessDenied showReturnButton={false} />
    </div>
  ) : (
    <ContextInventoryList {...props} activeFilters={activeFilters} onRefreshData={onRefreshData} />
  );
});

ContextInventoryList.propTypes = {
  ...InventoryList.propTypes,
  setRefresh: PropTypes.func,
  onRefreshData: PropTypes.func,
  ignoreRefresh: PropTypes.bool,
};
ContextInventoryList.defaultProps = {
  perPage: 50,
  page: 1,
  ignoreRefresh: true,
};
InventoryList.propTypes = {
  showTags: PropTypes.bool,
  filterEntities: PropTypes.func,
  loadEntities: PropTypes.func,
  showHealth: PropTypes.bool,
  page: PropTypes.number,
  perPage: PropTypes.number,
  sortBy: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.string,
  }),
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
      PropTypes.shape({
        account: PropTypes.any,
        isOpen: PropTypes.bool,
        title: PropTypes.node,
      }),
    ])
  ),
  entities: PropTypes.arrayOf(PropTypes.any),
  customFilters: PropTypes.shape({
    tags: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.string)]),
  }),
  getEntities: PropTypes.func,
  hideFilters: PropTypes.shape({
    tags: PropTypes.bool,
    name: PropTypes.bool,
    registeredWith: PropTypes.bool,
    stale: PropTypes.bool,
  }),
  onRefreshData: PropTypes.func,
};

InventoryList.defaultProps = {
  hasAccess: true,
};

export default InventoryList;
