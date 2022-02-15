import React from 'react';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import filters from '../__fixtures__/filters';
import useFilterConfig from './useFilterConfig';

const FilterItemsMockComponent = ({ filters }) => {
  const {
    toolbarProps: { filterConfig },
  } = useFilterConfig({ filters: { filterConfig: filters } });
  return `${filterConfig.items.length}`;
};

describe('useFilterConfig', () => {
  it('returns a filter config configuration', () => {
    const { result } = renderHook(() => useFilterConfig({ filters: { filterConfig: filters } }));
    expect(result.current).toMatchSnapshot();
  });

  it('works concurrently', () => {
    const component = (
      <>
        <FilterItemsMockComponent filters={filters.slice(2)} />
        <FilterItemsMockComponent filters={filters} />
      </>
    );
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });
});
