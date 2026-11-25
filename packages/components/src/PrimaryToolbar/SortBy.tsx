import { useIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import React, { KeyboardEvent } from 'react';

import { SortByDirection } from '@patternfly/react-table';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Icon } from '@patternfly/react-core/dist/dynamic/components/Icon';
import SortAmountDownIcon from '@patternfly/react-icons/dist/dynamic/icons/sort-amount-down-icon';
import SortAmountUpIcon from '@patternfly/react-icons/dist/dynamic/icons/sort-amount-up-icon';
import messages from '../messages';

export function flipDirection(direction: SortByDirection) {
  return direction === SortByDirection.asc ? SortByDirection.desc : SortByDirection.asc;
}

export interface SortByProps {
  direction?: SortByDirection;
  onSortChange?: (event: MouseEvent | React.MouseEvent<any, MouseEvent> | KeyboardEvent<Element>, direction: SortByDirection) => void;
}

const SortBy = ({ direction = SortByDirection.asc, onSortChange = () => undefined }: SortByProps) => {
  const intl = useIntlWithFallback();
  return (
    <Button
      icon={<Icon size="md">{direction === SortByDirection.asc ? <SortAmountUpIcon /> : <SortAmountDownIcon />}</Icon>}
      variant="plain"
      aria-label={direction === SortByDirection.asc ? intl.formatMessage(messages.sortByDescending) : intl.formatMessage(messages.sortByAscending)}
      onClick={(e) => onSortChange(e, flipDirection(direction))}
    />
  );
};

export default SortBy;
