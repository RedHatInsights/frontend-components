import React, { useState } from 'react';
import { MenuToggle, Select, SelectGroup, SelectList, SelectOption, getDefaultOUIAId } from '@patternfly/react-core';

import FilterInput from './FilterInput';
import './filter-dropdown.scss';
import './filter-input.scss';

export type FilterCategory = {
  title: string;
  type?: string;
  urlParam?: string;
  values: {
    label: string;
    value: string;
  }[];
};

export interface FilterDropdownProps {
  addFilter?: (filterName?: string, selectedValue?: string | number, type?: string) => void;
  removeFilter?: (filterName?: string, selectedValue?: string | number) => void;
  hideCategories?: [string | undefined];
  filters?: Record<string, string>;
  filterCategories: FilterCategory[];
  label: React.ReactNode;
  ouiaId?: string;
  ouiaSafe?: boolean;
}

const ouiaStateId = getDefaultOUIAId('RHI/FilterDropdown');

const FilterDropdown: React.FunctionComponent<FilterDropdownProps> = ({
  hideCategories,
  filters,
  filterCategories,
  label,
  ouiaId = ouiaStateId,
  ouiaSafe = true,
  addFilter,
  removeFilter,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const addRemoveFilters = (selectedValue?: string | number, filterName?: string, type?: string, isChecked?: boolean) => {
    console.log({ selectedValue, filterName });
    if (type === 'checkbox') {
      isChecked ? addFilter?.(filterName, selectedValue, type) : removeFilter?.(filterName, selectedValue);
    } else {
      addFilter?.(filterName, selectedValue, type);
    }
  };

  return (
    <Select
      className="ins-c-filter__dropdown"
      {...props}
      onOpenChange={setIsOpen}
      toggle={(toggleRef) => (
        <MenuToggle ref={toggleRef} isExpanded={isOpen} onClick={() => setIsOpen((prev) => !prev)}>
          {label}
        </MenuToggle>
      )}
      isOpen={isOpen}
      ouiaId={ouiaId}
      ouiaSafe={ouiaSafe}
    >
      {filterCategories.map(
        (data, index) =>
          !hideCategories?.includes(data?.urlParam) && (
            <SelectGroup label={data.title} key={index}>
              <SelectList>
                {data.values.map((item, key) => (
                  // FIXME: use SelectOption object rather than FilterInput. Will resolve:
                  // Clicking no the "edge" of the item does not trigger the change handler
                  // Using keyboard does not trigger the change event
                  <SelectOption key={`check${index}${key}`}>
                    <FilterInput
                      aria-label={item.label}
                      id={`check${index}${key}`}
                      label={item.label}
                      addRemoveFilters={addRemoveFilters}
                      param={data.urlParam}
                      type={data.type}
                      value={item.value}
                      filters={filters}
                    />
                  </SelectOption>
                ))}
              </SelectList>
            </SelectGroup>
          )
      )}
    </Select>
  );
};

export default FilterDropdown;
