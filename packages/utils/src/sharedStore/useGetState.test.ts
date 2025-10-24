import { renderHook, act } from '@testing-library/react';
import { createSharedStore } from './createSharedStore';
import { useGetState } from './useGetState';

// Mock crypto.randomUUID for testing
const mockRandomUUID = jest.fn();
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: mockRandomUUID,
  },
});

describe('useGetState', () => {
  beforeEach(() => {
    mockRandomUUID.mockClear();
    // Return predictable UUIDs for testing
    mockRandomUUID
      .mockReturnValueOnce('uuid-1')
      .mockReturnValueOnce('uuid-2')
      .mockReturnValueOnce('uuid-3')
      .mockReturnValueOnce('uuid-4')
      .mockReturnValueOnce('uuid-5');
  });

  describe('Initial state handling', () => {
    it('should return initial primitive state', () => {
      const store = createSharedStore({
        initialState: 42,
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => payload ?? state,
      });

      const { result } = renderHook(() => useGetState(store));

      expect(result.current).toBe(42);
    });

    it('should return initial string state', () => {
      const store = createSharedStore({
        initialState: 'hello world',
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => payload ?? state,
      });

      const { result } = renderHook(() => useGetState(store));

      expect(result.current).toBe('hello world');
    });

    it('should return initial boolean state', () => {
      const store = createSharedStore({
        initialState: true,
        events: ['TOGGLE'],
        onEventChange: (state) => !state,
      });

      const { result } = renderHook(() => useGetState(store));

      expect(result.current).toBe(true);
    });

    it('should return initial object state', () => {
      const initialState = { count: 0, name: 'test' };
      const store = createSharedStore({
        initialState,
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => ({ ...state, ...payload }),
      });

      const { result } = renderHook(() => useGetState(store));

      expect(result.current).toEqual({ count: 0, name: 'test' });
      // Initial render returns the original reference
      expect(result.current).toBe(initialState);
    });

    it('should return initial array state', () => {
      const initialState = [1, 2, 3];
      const store = createSharedStore({
        initialState,
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => payload ?? state,
      });

      const { result } = renderHook(() => useGetState(store));

      expect(result.current).toEqual([1, 2, 3]);
      // Initial render returns the original reference
      expect(result.current).toBe(initialState);
    });

    it('should handle null initial state', () => {
      const store = createSharedStore({
        initialState: null,
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => payload ?? state,
      });

      const { result } = renderHook(() => useGetState(store));

      expect(result.current).toBe(null);
    });
  });

  describe('State updates', () => {
    it('should update when store state changes for primitive values', () => {
      const store = createSharedStore({
        initialState: 0,
        events: ['INCREMENT', 'SET'],
        onEventChange: (state, event, payload) => {
          if (event === 'INCREMENT') return state + (payload || 1);
          if (event === 'SET') return payload;
          return state;
        },
      });

      const { result } = renderHook(() => useGetState(store));

      expect(result.current).toBe(0);

      act(() => {
        store.updateState('INCREMENT');
      });

      expect(result.current).toBe(1);

      act(() => {
        store.updateState('SET', 42);
      });

      expect(result.current).toBe(42);
    });

    it('should update when store state changes for objects with immutability', () => {
      const store = createSharedStore({
        initialState: { count: 0, name: 'test' },
        events: ['UPDATE_COUNT', 'UPDATE_NAME'],
        onEventChange: (state, event, payload) => {
          if (event === 'UPDATE_COUNT') return { ...state, count: payload };
          if (event === 'UPDATE_NAME') return { ...state, name: payload };
          return state;
        },
      });

      const { result } = renderHook(() => useGetState(store));

      const initialResult = result.current;
      expect(initialResult).toEqual({ count: 0, name: 'test' });

      act(() => {
        store.updateState('UPDATE_COUNT', 5);
      });

      expect(result.current).toEqual({ count: 5, name: 'test' });
      // Should be a new object (immutable)
      expect(result.current).not.toBe(initialResult);

      const afterCountUpdate = result.current;

      act(() => {
        store.updateState('UPDATE_NAME', 'updated');
      });

      expect(result.current).toEqual({ count: 5, name: 'updated' });
      // Should be a new object (immutable)
      expect(result.current).not.toBe(afterCountUpdate);
    });

    it('should update when store state changes for arrays with immutability', () => {
      const store = createSharedStore({
        initialState: [1, 2, 3],
        events: ['ADD_ITEM', 'REPLACE_ARRAY'],
        onEventChange: (state, event, payload) => {
          if (event === 'ADD_ITEM') return [...state, payload];
          if (event === 'REPLACE_ARRAY') return payload;
          return state;
        },
      });

      const { result } = renderHook(() => useGetState(store));

      const initialResult = result.current;
      expect(initialResult).toEqual([1, 2, 3]);

      act(() => {
        store.updateState('ADD_ITEM', 4);
      });

      expect(result.current).toEqual([1, 2, 3, 4]);
      // Should be a new array (immutable)
      expect(result.current).not.toBe(initialResult);

      act(() => {
        store.updateState('REPLACE_ARRAY', [10, 20]);
      });

      expect(result.current).toEqual([10, 20]);
    });

    it('should handle rapid state updates', () => {
      const store = createSharedStore({
        initialState: 0,
        events: ['INCREMENT'],
        onEventChange: (state) => state + 1,
      });

      const { result } = renderHook(() => useGetState(store));

      expect(result.current).toBe(0);

      // Perform multiple rapid updates
      act(() => {
        for (let i = 0; i < 10; i++) {
          store.updateState('INCREMENT');
        }
      });

      expect(result.current).toBe(10);
    });
  });

  describe('Complex state scenarios', () => {
    it('should handle nested object state with deep immutability', () => {
      type ComplexState = {
        user: { name: string; profile: { age: number; city: string } };
        settings: { theme: string };
      };

      const store = createSharedStore({
        initialState: {
          user: { name: 'John', profile: { age: 25, city: 'NYC' } },
          settings: { theme: 'dark' },
        } as ComplexState,
        events: ['UPDATE_USER_NAME', 'UPDATE_USER_AGE', 'UPDATE_THEME'] as const,
        onEventChange: (state: ComplexState, event, payload: any): ComplexState => {
          switch (event) {
            case 'UPDATE_USER_NAME':
              return {
                ...state,
                user: { ...state.user, name: payload },
              };
            case 'UPDATE_USER_AGE':
              return {
                ...state,
                user: {
                  ...state.user,
                  profile: { ...state.user.profile, age: payload },
                },
              };
            case 'UPDATE_THEME':
              return {
                ...state,
                settings: { ...state.settings, theme: payload },
              };
            default:
              return state;
          }
        },
      });

      const { result } = renderHook(() => useGetState(store));

      const initialResult = result.current as ComplexState;
      expect(initialResult.user.name).toBe('John');
      expect(initialResult.user.profile.age).toBe(25);

      act(() => {
        store.updateState('UPDATE_USER_NAME', 'Jane');
      });

      const afterNameUpdate = result.current as ComplexState;
      expect(afterNameUpdate.user.name).toBe('Jane');
      expect(afterNameUpdate.user.profile.age).toBe(25); // Should remain unchanged
      expect(afterNameUpdate).not.toBe(initialResult); // New object

      act(() => {
        store.updateState('UPDATE_USER_AGE', 30);
      });

      const afterAgeUpdate = result.current as ComplexState;
      expect(afterAgeUpdate.user.name).toBe('Jane');
      expect(afterAgeUpdate.user.profile.age).toBe(30);
      expect(afterAgeUpdate.settings.theme).toBe('dark'); // Should remain unchanged
    });

    it('should handle mixed array and object state', () => {
      type Item = { id: number; name: string };
      type MixedState = {
        items: Item[];
        count: number;
      };

      const store = createSharedStore({
        initialState: {
          items: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
          count: 2,
        } as MixedState,
        events: ['ADD_ITEM', 'REMOVE_ITEM'] as const,
        onEventChange: (state: MixedState, event, payload: any): MixedState => {
          if (event === 'ADD_ITEM') {
            return {
              ...state,
              items: [...state.items, payload],
              count: state.count + 1,
            };
          }
          if (event === 'REMOVE_ITEM') {
            return {
              ...state,
              items: state.items.filter((item: Item) => item.id !== payload),
              count: state.count - 1,
            };
          }
          return state;
        },
      });

      const { result } = renderHook(() => useGetState(store));

      const currentState = result.current as MixedState;
      expect(currentState.items).toHaveLength(2);
      expect(currentState.count).toBe(2);

      act(() => {
        store.updateState('ADD_ITEM', { id: 3, name: 'Item 3' });
      });

      const afterAdd = result.current as MixedState;
      expect(afterAdd.items).toHaveLength(3);
      expect(afterAdd.count).toBe(3);
      expect(afterAdd.items[2]).toEqual({ id: 3, name: 'Item 3' });

      act(() => {
        store.updateState('REMOVE_ITEM', 1);
      });

      const afterRemove = result.current as MixedState;
      expect(afterRemove.items).toHaveLength(2);
      expect(afterRemove.count).toBe(2);
      expect(afterRemove.items.find((item: Item) => item.id === 1)).toBeUndefined();
    });
  });

  describe('Subscription management', () => {
    it('should unsubscribe from store when hook unmounts', () => {
      const store = createSharedStore({
        initialState: 0,
        events: ['INCREMENT'],
        onEventChange: (state) => state + 1,
      });

      // Spy on the unsubscribe function
      const mockUnsubscribe = jest.fn();
      jest.spyOn(store, 'subscribeAll').mockReturnValue(mockUnsubscribe);

      const { unmount } = renderHook(() => useGetState(store));

      expect(store.subscribeAll).toHaveBeenCalledTimes(1);
      expect(mockUnsubscribe).not.toHaveBeenCalled();

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should not update state after unmount', () => {
      const store = createSharedStore({
        initialState: 0,
        events: ['INCREMENT'],
        onEventChange: (state) => state + 1,
      });

      const { result, unmount } = renderHook(() => useGetState(store));

      expect(result.current).toBe(0);

      unmount();

      // Update store after unmount - should not cause issues
      act(() => {
        store.updateState('INCREMENT');
      });

      // Since the hook is unmounted, we can't check result.current
      // But this test ensures no errors are thrown
      expect(store.getState()).toBe(1);
    });

    it('should handle multiple store subscriptions correctly', () => {
      const store1 = createSharedStore({
        initialState: 'store1',
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => payload ?? state,
      });

      const store2 = createSharedStore({
        initialState: 'store2',
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => payload ?? state,
      });

      const { result: result1 } = renderHook(() => useGetState(store1));
      const { result: result2 } = renderHook(() => useGetState(store2));

      expect(result1.current).toBe('store1');
      expect(result2.current).toBe('store2');

      act(() => {
        store1.updateState('UPDATE', 'updated1');
      });

      expect(result1.current).toBe('updated1');
      expect(result2.current).toBe('store2'); // Should remain unchanged

      act(() => {
        store2.updateState('UPDATE', 'updated2');
      });

      expect(result1.current).toBe('updated1'); // Should remain unchanged
      expect(result2.current).toBe('updated2');
    });
  });

  describe('Edge cases', () => {
    it('should handle zero as initial state', () => {
      const store = createSharedStore({
        initialState: 0,
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => payload ?? state,
      });

      const { result } = renderHook(() => useGetState(store));

      expect(result.current).toBe(0);

      act(() => {
        store.updateState('UPDATE', 42);
      });

      expect(result.current).toBe(42);
    });

    it('should ensure immutability for objects during updates', () => {
      const initialState = { count: 0 };
      const store = createSharedStore({
        initialState,
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => ({ ...state, count: payload }),
      });

      const { result } = renderHook(() => useGetState(store));

      // Initial render returns original reference
      expect(result.current).toBe(initialState);

      act(() => {
        store.updateState('UPDATE', 5);
      });

      // After update, should return a new object (immutable)
      expect(result.current).not.toBe(initialState);
      expect(result.current).toEqual({ count: 5 });
    });

    it('should ensure immutability for arrays during updates', () => {
      const initialState = [1, 2, 3];
      const store = createSharedStore({
        initialState,
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => [...state, payload],
      });

      const { result } = renderHook(() => useGetState(store));

      // Initial render returns original reference
      expect(result.current).toBe(initialState);

      act(() => {
        store.updateState('UPDATE', 4);
      });

      // After update, should return a new array (immutable)
      expect(result.current).not.toBe(initialState);
      expect(result.current).toEqual([1, 2, 3, 4]);
    });

    it('should handle empty object state', () => {
      const store = createSharedStore({
        initialState: {},
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => ({ ...state, ...payload }),
      });

      const { result } = renderHook(() => useGetState(store));

      expect(result.current).toEqual({});

      act(() => {
        store.updateState('UPDATE', { key: 'value' });
      });

      expect(result.current).toEqual({ key: 'value' });
    });

    it('should handle empty array state', () => {
      const store = createSharedStore({
        initialState: [],
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => payload ?? state,
      });

      const { result } = renderHook(() => useGetState(store));

      expect(result.current).toEqual([]);

      act(() => {
        store.updateState('UPDATE', [1, 2, 3]);
      });

      expect(result.current).toEqual([1, 2, 3]);
    });

    it('should maintain reference equality for primitive values', () => {
      const store = createSharedStore({
        initialState: 42,
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => payload ?? state,
      });

      const { result, rerender } = renderHook(() => useGetState(store));

      const firstValue = result.current;
      expect(firstValue).toBe(42);

      // Rerender without state change
      rerender();

      expect(result.current).toBe(42);
      expect(result.current).toBe(firstValue); // Same reference for primitives

      act(() => {
        store.updateState('UPDATE', 42); // Same value
      });

      expect(result.current).toBe(42);
    });

    it('should create new objects even for same content', () => {
      const store = createSharedStore({
        initialState: { count: 0 },
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => ({ ...state, ...payload }),
      });

      const { result } = renderHook(() => useGetState(store));

      const firstObject = result.current;

      act(() => {
        store.updateState('UPDATE', { count: 0 }); // Same content
      });

      expect(result.current).toEqual({ count: 0 });
      // Should be a new object even with same content
      expect(result.current).not.toBe(firstObject);
    });
  });
});
