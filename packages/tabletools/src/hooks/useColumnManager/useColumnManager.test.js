import { renderHook } from '@testing-library/react-hooks';
import columns from '../__fixtures__/columns';
import useColumnManager from './useColumnManager';

describe('useColumnManager', () => {
  const defaultArguments = [columns, { manageColumns: true }];
  it('returns just columns if not enabled', () => {
    const { result } = renderHook(() => useColumnManager(columns));
    expect(result).toMatchSnapshot();
  });

  it('returns just columns if not enabled', () => {
    const { result } = renderHook(() => useColumnManager(...defaultArguments));
    expect(result).toMatchSnapshot();
  });
});
