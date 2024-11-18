import React, { KeyboardEvent } from 'react';
import { SortByDirection } from '@patternfly/react-table';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Icon } from '@patternfly/react-core/dist/dynamic/components/Icon';
import SortAmountDownIcon from '@patternfly/react-icons/dist/dynamic/icons/sort-amount-down-icon';
import SortAmountUpIcon from '@patternfly/react-icons/dist/dynamic/icons/sort-amount-up-icon';

export function flipDirection(direction: SortByDirection) {
  return direction === SortByDirection.asc ? SortByDirection.desc : SortByDirection.asc;
}

export interface SortByProps {
  direction?: SortByDirection;
  onSortChange?: (event: MouseEvent | React.MouseEvent<any, MouseEvent> | KeyboardEvent<Element>, direction: SortByDirection) => void;
}

const SortBy: React.FunctionComponent<SortByProps> = ({ direction = SortByDirection.asc, onSortChange = () => undefined }) => (
  <Button variant="plain" onClick={(e) => onSortChange(e, flipDirection(direction))}>
    <Icon size="md">{direction === SortByDirection.asc ? <SortAmountUpIcon /> : <SortAmountDownIcon />}</Icon>
  </Button>
);

export default SortBy;
