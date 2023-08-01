import React, { useState } from 'react';
import { Level, getDefaultOUIAId } from '@patternfly/react-core';
import { Dropdown, DropdownToggle } from '@patternfly/react-core/deprecated';

import FilterInput from './FilterInput';
import './filter-dropdown.scss';

export type FilterCategory = {
  title?: string;
  type?: string;
  urlParam?: string;
  values?: {
    label?: string;
    value?: string;
  }[];
};

export interface FilterDropdownProps {
  addFilter?: (filterName?: string, selectedValue?: string | number, type?: string) => void;
  removeFilter?: (filterName?: string, selectedValue?: string | number) => void;
  hideCategories?: [string | undefined];
  filters?: Record<string, string>;
  filterCategories?: FilterCategory[];
  label?: React.ReactNode;
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
    if (type === 'checkbox') {
      isChecked ? addFilter?.(filterName, selectedValue, type) : removeFilter?.(filterName, selectedValue);
    } else {
      addFilter?.(filterName, selectedValue, type);
    }
  };

  return (
    <Dropdown
      className="ins-c-filter__dropdown"
      {...props}
      toggle={
        <DropdownToggle ouiaId={ouiaId} ouiaSafe={ouiaSafe} onToggle={(_e, isOpen) => setIsOpen(isOpen)}>
          {label}
        </DropdownToggle>
      }
      isOpen={isOpen}
      ouiaId={ouiaId}
      ouiaSafe={ouiaSafe}
    >
      <div className="pf-v5-c-dropdown__menu-item">
        {filterCategories?.map(
          (data: FilterCategory, index) =>
            !hideCategories?.includes(data?.urlParam) && (
              <Level key={`${data.urlParam}${index}`}>
                {data.title || ''}
                {data.values?.map((item: { label?: React.ReactNode; value?: string }, key: string | number) => (
                  <FilterInput
                    key={`check${index}${key}`}
                    aria-label={item.label}
                    id={`${data.urlParam}${key}`}
                    label={item.label}
                    addRemoveFilters={addRemoveFilters}
                    param={data.urlParam}
                    type={data.type}
                    value={item.value}
                    filters={filters}
                  />
                ))}
                {index !== filterCategories.length - 1 && <br />}
              </Level>
            )
        )}
      </div>
    </Dropdown>
  );
};

export default FilterDropdown;
