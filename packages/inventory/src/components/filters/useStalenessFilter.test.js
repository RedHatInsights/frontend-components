/* eslint-disable react/prop-types */
import React, { Fragment, useEffect } from 'react';
import { useStalenessFilter } from './useStalenessFilter';
import { mount } from 'enzyme';

const HookRender = ({ hookAccessor, hookNotify }) => {
  const [filter, chip, value, setValue] = useStalenessFilter();
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

describe('useStalenessFilter', () => {
  it('should create filter', () => {
    const hookAccessor = ([filter]) => {
      expect(filter).toMatchObject({
        label: 'Status',
        value: 'stale-status',
        type: 'checkbox',
      });
      expect(filter.filterValues.value.length).toBe(0);
      expect(filter.filterValues.items).toMatchObject([
        { label: 'Fresh', value: 'fresh' },
        { label: 'Stale', value: 'stale' },
        { label: 'Stale warning', value: 'stale_warning' },
      ]);
    };

    mount(<HookRender hookAccessor={hookAccessor} />);
  });

  it('should create chip', () => {
    const hookAccessor = ([, , , setValue]) => {
      setValue(['stale']);
    };

    const hookNotify = ([filter, chip, value]) => {
      expect(value).toMatchObject(['stale']);
      expect(filter.filterValues.value.length).toBe(1);
      expect(chip).toMatchObject([{ category: 'Status', chips: [{ name: 'Stale', value: 'stale' }], type: 'staleness' }]);
    };

    mount(<HookRender hookAccessor={hookAccessor} hookNotify={hookNotify} />);
  });
});
