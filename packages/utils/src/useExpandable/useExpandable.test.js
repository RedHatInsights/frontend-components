import { renderHook } from '@testing-library/react-hooks';
import useExpandable from './useExpandable';

const ExampleDetailsRow = (item) => {
  return `DETAILS for ${item.name}`;
};

describe('useExpandable', () => {
  const defaultOptions = {
    detailsComponent: ExampleDetailsRow,
  };

  it('returns an expandable configuration', () => {
    const { result } = renderHook(() => useExpandable(defaultOptions));

    expect(result).toMatchSnapshot();
  });
});
