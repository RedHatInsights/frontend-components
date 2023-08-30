import React, { useEffect, useState } from 'react';
import { Checkbox, Radio } from '@patternfly/react-core';

export interface FilterInputProps {
  addRemoveFilters?: (value?: string, param?: string, type?: string, checked?: boolean) => void;
  className?: string;
  currentPage?: string;
  id: string;
  label: React.ReactNode;
  param?: string;
  value?: string;
  filters?: any;
  type?: string;
}

const FilterInput: React.FC<FilterInputProps> = ({ addRemoveFilters, param = '', filters = {}, type = 'checkbox', value, id, label }) => {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (type !== 'radio') {
      if (param in filters && filters?.[param]?.includes(value)) {
        setChecked(true);
      } else {
        setChecked(false);
      }
    }
  }, []);
  const handleChange = () => {
    if (type === 'checkbox') {
      return setChecked((prev) => {
        addRemoveFilters?.(value, param, type, !prev);
        return !prev;
      });
    }
    addRemoveFilters?.(value, param, type, checked);
  };
  if (type !== 'radio') {
    return (
      <Checkbox
        className="ins-c-filter-input__checkbox"
        aria-label={String(label)}
        id={id}
        isChecked={checked}
        label={label}
        onChange={handleChange}
        value={value}
        ouiaId={String(label)}
      />
    );
  }
  return (
    <Radio
      className="ins-c-filter-input__checkbox"
      isChecked={filters && !!value && !!param && filters[param] === value}
      aria-label={String(label)}
      id={id}
      label={label}
      name={param}
      onChange={handleChange}
      value={value}
      ouiaId={String(label)}
    />
  );
};

export default FilterInput;
