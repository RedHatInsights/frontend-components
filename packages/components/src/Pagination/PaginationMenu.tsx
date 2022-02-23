import React, { useState } from 'react';
import { CaretDownIcon, CaretUpIcon, CheckIcon } from '@patternfly/react-icons';
import { Dropdown, DropdownDirection, DropdownItem, DropdownToggle } from '@patternfly/react-core';

export type PageOption = {
  title: React.ReactNode;
  value: number;
};

export interface PaginationNavProps {
  itemsTitle?: string;
  itemsStart?: number;
  itemsEnd?: number;
  dropDirection?: DropdownDirection;
  widtgetId?: string;
  onSetPerPage: (event: MouseEvent | React.MouseEvent<any, MouseEvent> | React.KeyboardEvent<Element>, value: number) => void;
  itemCount: number;
  perPage?: number;
  perPageOptions?: PageOption[];
  className?: string;
}

const PaginationNav: React.FunctionComponent<PaginationNavProps> = ({
  itemsTitle = 'items',
  itemsStart,
  itemsEnd,
  widtgetId,
  dropDirection = DropdownDirection.up,
  onSetPerPage,
  itemCount,
  perPageOptions = [],
  className = '',
  perPage,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSelect = () => setIsOpen((prev) => !prev);
  return (
    <div className={`pf-c-options-menu ${className}`} {...props}>
      <span id={`${widtgetId}-label`} hidden>
        Items per page:
      </span>
      <div className="pf-c-options-menu__toggle pf-m-text pf-m-plain">
        <Dropdown
          direction={dropDirection}
          isPlain
          isOpen={isOpen}
          onSelect={onSelect}
          dropdownItems={perPageOptions.map(({ title, value }) => (
            <DropdownItem onClick={(event) => value !== perPage && onSetPerPage(event, value)} key={value} component="button">
              {title}
              {value === perPage && <CheckIcon className="pf-c-options-menu__menu-item-icon" size="md" />}
            </DropdownItem>
          ))}
          toggle={
            <DropdownToggle onToggle={(isOpen) => setIsOpen(isOpen)} toggleIndicator={null} className="pf-c-options-menu__toggle-button">
              <span className="pf-c-options-menu__toggle-text">
                <b>
                  {itemsStart} - {itemsEnd}
                </b>{' '}
                of <b>{itemCount}</b> {itemsTitle}
              </span>
              {dropDirection === 'up' ? <CaretUpIcon /> : <CaretDownIcon />}
            </DropdownToggle>
          }
        />
      </div>
    </div>
  );
};

export default PaginationNav;
