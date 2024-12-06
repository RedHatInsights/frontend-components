import React, { useState } from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { ButtonVariant } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Dropdown } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownItem } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownList } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { MenuToggle } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import { TextInput } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import { TextInputProps } from '@patternfly/react-core/dist/dynamic/components/TextInput';

import SearchIcon from '@patternfly/react-icons/dist/dynamic/icons/search-icon';
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
    <div className={`pf-v6-c-input-group ins-c-filter ${!buttonTitle ? 'ins-u-no-title' : ''} ${className}`} {...props}>
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
          popperProps={{ appendTo: 'inline' }}
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
