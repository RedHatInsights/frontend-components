import { act, renderHook } from '@testing-library/react-hooks';
import useSelectionManager from './useSelectionManager';

describe('useSelectionManager', () => {
  it('returns an object with function to manage selections', () => {
    const { result } = renderHook(() => useSelectionManager());
    expect(result).toMatchSnapshot();
  });

  describe('withGroups: false', () => {
    const defaultArguments = [[1, 2, 3, 4]];

    it('returns an object with function to manage selections wihtout groups', () => {
      const { result } = renderHook(() => useSelectionManager(...defaultArguments));
      expect(result.current.selection).toEqual(defaultArguments[0]);
      expect(result.current).toMatchSnapshot();
    });

    it('adds an item from the selection when calling select', () => {
      const { result } = renderHook(() => useSelectionManager(...defaultArguments));

      act(() => {
        result.current.select(42);
      });

      expect(result.current).toMatchSnapshot();
    });

    it('removes an item from the selection when calling deselect', () => {
      const { result } = renderHook(() => useSelectionManager(...defaultArguments));

      act(() => {
        result.current.deselect(3);
      });

      expect(result.current).toMatchSnapshot();
    });

    it('sets items for a selection when calling set', () => {
      const { result } = renderHook(() => useSelectionManager(...defaultArguments));

      act(() => {
        result.current.set([0, 9, 8, 45, 3]);
      });

      expect(result.current).toMatchSnapshot();
    });
  });

  describe('withGroups true', () => {
    const defaultArguments = [{ group1: [1, 2, 3, 4], group2: [12, 23, 34, 45] }, { withGroups: true }];

    it('returns an object with function to manage selections with groups', () => {
      const { result } = renderHook(() => useSelectionManager(...defaultArguments));
      expect(result.current).toMatchSnapshot();
    });

    it('adds an item from the selection when calling select', () => {
      const { result } = renderHook(() => useSelectionManager(...defaultArguments));

      act(() => {
        result.current.select(42, 'group2');
      });

      expect(result.current).toMatchSnapshot();
    });

    it('removes an item from the selection when calling deselect', () => {
      const { result } = renderHook(() => useSelectionManager(...defaultArguments));

      act(() => {
        result.current.deselect(2, 'group1');
      });

      expect(result.current).toMatchSnapshot();
    });

    it('sets items for a selection when calling set', () => {
      const { result } = renderHook(() => useSelectionManager(...defaultArguments));

      act(() => {
        result.current.set([0, 9, 8, 45, 3], 'group1');
      });

      expect(result.current).toMatchSnapshot();
    });
  });
});
