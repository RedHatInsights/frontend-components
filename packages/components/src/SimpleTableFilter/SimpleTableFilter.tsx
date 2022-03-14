import React, { useState } from 'react';
import { Button, ButtonVariant, Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';
import { Input } from '../Input';
import { SearchIcon } from '@patternfly/react-icons';
import './simple-table-filter.scss';

export type SimpleFilterOptionItem = {
  value?: string;
  title?: string;
};

export type SimpleFilterOption = {
  title?: string;
  items?: SimpleFilterOptionItem[];
};

export interface SimpleFilterProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  widgetId?: string;
  buttonTitle?: string;
  placeholder?: string;
  className?: string;
  options?: SimpleFilterOption;
  onButtonClick?: (activeFilter: string, selected?: SimpleFilterOptionItem) => void;
  onFilterChange?: (value: string, selected?: SimpleFilterOptionItem) => void;
  onOptionSelect?: (event: MouseEvent | React.MouseEvent<any, MouseEvent> | React.KeyboardEvent<Element>, oneItem: SimpleFilterOptionItem) => void;
  searchIcon?: boolean;
}

const SimpleFilter: React.FC<SimpleFilterProps> = ({
  options,
  widgetId,
  className = '',
  placeholder = 'Search items',
  buttonTitle = 'Filter',
  onButtonClick = () => undefined,
  onFilterChange = () => undefined,
  onOptionSelect = () => undefined,
  searchIcon = true,
  ...props
}) => {
  const [activeFilter, setActiveFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<undefined | SimpleFilterOptionItem>();

  const onToggle = (isOpen: boolean) => setIsOpen(isOpen);

  const onInputChange = (event: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
    setActiveFilter((event as React.ChangeEvent<HTMLInputElement>).target?.value);
    onFilterChange((event as React.ChangeEvent<HTMLInputElement>).target.value, selected);
  };

  const onFilterSubmit = () => {
    onButtonClick(activeFilter, selected);
  };

  const onFilterSelect = (event: MouseEvent | React.MouseEvent<any, MouseEvent> | React.KeyboardEvent<Element>, oneItem: SimpleFilterOptionItem) => {
    setSelected(oneItem);
    onOptionSelect(event, oneItem);
  };

  const onSelect = () => setIsOpen(false);

  const dropdownItems =
    options &&
    options.items &&
    options.items.map((oneItem) => (
      <DropdownItem component="button" key={oneItem.value} onClick={(event) => onFilterSelect(event, oneItem)} data-key={oneItem.value}>
        {oneItem.title}
      </DropdownItem>
    ));
  return (
    <div className={`pf-c-input-group ins-c-filter ${!buttonTitle ? 'ins-u-no-title' : ''} ${className}`} {...props}>
      {options && (
        <Dropdown
          onSelect={onSelect}
          isOpen={isOpen}
          toggle={<DropdownToggle onToggle={onToggle}>{(selected && selected.title) || options.title || 'Dropdown'}</DropdownToggle>}
          dropdownItems={dropdownItems}
        />
      )}
      <Input
        placeholder={placeholder}
        onKeyPress={(event) => event.key === 'Enter' && onInputChange(event)}
        widget-id={widgetId}
        onChange={(event) => onInputChange(event)}
      />
      {!buttonTitle && searchIcon && <SearchIcon size="sm" className="ins-c-search-icon" />}
      {buttonTitle && (
        <Button variant={ButtonVariant.secondary} action="filter" onClick={onFilterSubmit}>
          {buttonTitle}
        </Button>
      )}
    </div>
  );
};

export default SimpleFilter;
