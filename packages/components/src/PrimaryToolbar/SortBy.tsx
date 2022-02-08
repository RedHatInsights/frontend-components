import React from 'react';
import { SortByDirection } from '@patternfly/react-table';
import { Button } from '@patternfly/react-core';
import { SortAmountDownIcon, SortAmountUpIcon } from '@patternfly/react-icons';

export function flipDirection(direction: SortByDirection) {
  return direction === SortByDirection.asc ? SortByDirection.desc : SortByDirection.asc;
}

export interface SortByProps {
  direction?: SortByDirection;
  onSortChange?: (event: React.MouseEvent<Element, MouseEvent> | undefined, direction: SortByDirection) => void;
}

const SortBy: React.FunctionComponent<SortByProps> = ({ direction = SortByDirection.asc, onSortChange = () => undefined }) => (
  <Button variant="plain" onClick={(e) => onSortChange(e, flipDirection(direction))}>
    {direction === SortByDirection.asc ? <SortAmountUpIcon size="sm" /> : <SortAmountDownIcon size="sm" />}
  </Button>
);

export default SortBy;
