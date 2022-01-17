import React from 'react';
import PropTypes from 'prop-types';
import { SortByDirection } from '@patternfly/react-table';
import { Button } from '@patternfly/react-core';
import { SortAmountDownIcon, SortAmountUpIcon } from '@patternfly/react-icons';

export function flipDirection(direction) {
  return direction === SortByDirection.asc ? SortByDirection.desc : SortByDirection.asc;
}

const SortBy = ({ direction, onSortChange }) => (
  <Button variant="plain" onClick={(e) => onSortChange(e, flipDirection(direction))}>
    {direction === SortByDirection.asc ? <SortAmountUpIcon size="sm" /> : <SortAmountDownIcon size="sm" />}
  </Button>
);

SortBy.propTypes = {
  direction: PropTypes.oneOf(Object.values(SortByDirection)),
  onSortChange: PropTypes.func,
};

SortBy.defaultProps = {
  direction: SortByDirection.asc,
  onSortChange: () => undefined,
};

export default SortBy;
