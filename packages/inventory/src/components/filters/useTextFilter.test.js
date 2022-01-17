/* eslint-disable react/prop-types */
import React, { Fragment, useEffect } from 'react';
import { useTextFilter } from './useTextFilter';
import { mount } from 'enzyme';

const HookRender = ({ hookAccessor, hookNotify }) => {
  const [filter, chip, value, setValue] = useTextFilter();
  useEffect(() => {
    hookAccessor && hookAccessor([filter, chip, value, setValue]);
  }, []);
  useEffect(() => {
    if (value.length !== 0) {
      hookNotify && hookNotify([filter, chip, value, setValue]);
    }
  }, [value]);

  return <Fragment />;
};

describe('useTextFilter', () => {
  it('should create filter', () => {
    const hookAccessor = ([filter]) => {
      expect(filter).toMatchObject({
        label: 'Name',
        value: 'name-filter',
      });
      expect(filter.filterValues.value.length).toBe(0);
      expect(filter.filterValues.placeholder).toBe('Filter by name');
    };

    mount(<HookRender hookAccessor={hookAccessor} />);
  });

  it('should create chip', () => {
    const hookAccessor = ([, , , setValue]) => {
      setValue('test');
    };

    const hookNotify = ([filter, chip, value]) => {
      expect(value).toBe('test');
      expect(filter.filterValues.value).toBe('test');
      expect(chip).toMatchObject([{ category: 'Display name', chips: [{ name: 'test' }], type: 'textual' }]);
    };

    mount(<HookRender hookAccessor={hookAccessor} hookNotify={hookNotify} />);
  });
});
