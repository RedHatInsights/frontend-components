import React, { useState } from 'react';
import { Button, ButtonVariant, Dropdown, DropdownItem, DropdownList, Icon, MenuToggle, TextInput, TextInputProps } from '@patternfly/react-core';

import { SearchIcon } from '@patternfly/react-icons';
import './simple-table-filter.scss';

export type SimpleFilterOptionItem = {
  value: string;
  title: string;
};

export type SimpleFilterOption = {
  title: string;
  items: SimpleFilterOptionItem[];
};

export interface SimpleFilterProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  buttonTitle?: string;
  placeholder?: string;
  className?: string;
  options?: SimpleFilterOption;
  onButtonClick?: (activeFilter: string, selected?: SimpleFilterOptionItem) => void;
  onFilterChange: (value: string, selected?: SimpleFilterOptionItem) => void;
  onOptionSelect?: (event: MouseEvent | React.MouseEvent<any, MouseEvent> | React.KeyboardEvent<Element>, oneItem: SimpleFilterOptionItem) => void;
  searchIcon?: boolean;
}

const SimpleFilter: React.FC<SimpleFilterProps> = ({
  options,
  className,
  placeholder = 'Search items',
  buttonTitle = 'Filter',
  onButtonClick,
  onFilterChange,
  onOptionSelect,
  searchIcon = true,
  ...props
}) => {
  const [activeFilter, setActiveFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<undefined | SimpleFilterOptionItem>();

  const onInputChange: TextInputProps['onChange'] = (_e, value) => {
    setActiveFilter(value);
    onFilterChange(value, selected);
  };

  const onFilterSubmit = () => {
    onButtonClick?.(activeFilter, selected);
  };

  const onFilterSelect = (event: MouseEvent | React.MouseEvent<any, MouseEvent> | React.KeyboardEvent<Element>, oneItem: SimpleFilterOptionItem) => {
    setSelected(oneItem);
    onOptionSelect?.(event, oneItem);
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
  // FIXME: Fix the layout in primary toolbar
  return (
    <div className={`pf-v5-c-input-group ins-c-filter ${!buttonTitle ? 'ins-u-no-title' : ''} ${className}`} {...props}>
      {options && (
        <Dropdown
          onSelect={onSelect}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          toggle={(toggleRef) => (
            <MenuToggle ref={toggleRef} onClick={() => setIsOpen((prev) => !prev)} isExpanded={isOpen}>
              {selected?.title || options.title || 'Dropdown'}
            </MenuToggle>
          )}
        >
          <DropdownList>{dropdownItems}</DropdownList>
        </Dropdown>
      )}
      {/* FIXME: Find some relevant label or ID */}
      <TextInput
        onKeyUp={(e) => {
          if (e.code === 'Enter') {
            onInputChange(e, (e.target as HTMLInputElement).value);
          }
        }}
        aria-label="simple-table-filter"
        placeholder={placeholder}
        onChange={onInputChange}
        {...(!buttonTitle && searchIcon && { customIcon: <SearchIcon className="ins-c-search-icon" /> })}
      />
      {buttonTitle && (
        <Button variant={ButtonVariant.secondary} action="filter" onClick={onFilterSubmit}>
          {buttonTitle}
        </Button>
      )}
    </div>
  );
};

export default SimpleFilter;
