import { renderHook, act } from '@testing-library/react';
import { createSharedStore } from './createSharedStore';
import { useSubscribeStore } from './useSubscribeStore';

// Mock crypto.randomUUID for testing
const mockRandomUUID = jest.fn();
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: mockRandomUUID,
  },
});

describe('useSubscribeStore', () => {
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

  describe('Basic functionality', () => {
    it('should return initial selected value from primitive state', () => {
      const store = createSharedStore({
        initialState: 42,
        events: ['INCREMENT', 'SET'],
        onEventChange: (state, event, payload) => {
          if (event === 'INCREMENT') return state + (payload || 1);
          if (event === 'SET') return payload;
          return state;
        },
      });

      const { result } = renderHook(() =>
        useSubscribeStore(store, 'INCREMENT', (state) => state * 2)
      );

      expect(result.current).toBe(84); // 42 * 2
    });

    it('should return initial selected value from object state', () => {
      const store = createSharedStore({
        initialState: { count: 10, name: 'test' },
        events: ['UPDATE_COUNT', 'UPDATE_NAME'],
        onEventChange: (state, event, payload) => {
          if (event === 'UPDATE_COUNT') return { ...state, count: payload };
          if (event === 'UPDATE_NAME') return { ...state, name: payload };
          return state;
        },
      });

      const { result } = renderHook(() =>
        useSubscribeStore(store, 'UPDATE_COUNT', (state) => state.count)
      );

      expect(result.current).toBe(10);
    });

    it('should return selected object and ensure immutability on updates', () => {
      const store = createSharedStore({
        initialState: { user: { name: 'John', age: 25 }, settings: { theme: 'dark' } },
        events: ['UPDATE_USER', 'UPDATE_SETTINGS'],
        onEventChange: (state, event, payload) => {
          if (event === 'UPDATE_USER') return { ...state, user: { ...state.user, ...payload } };
          if (event === 'UPDATE_SETTINGS') return { ...state, settings: { ...state.settings, ...payload } };
          return state;
        },
      });

      const originalUser = store.getState().user;
      const { result } = renderHook(() =>
        useSubscribeStore(store, 'UPDATE_USER', (state) => state.user)
      );

      expect(result.current).toEqual({ name: 'John', age: 25 });
      // Initial render returns original reference (like useGetState)
      expect(result.current).toBe(originalUser);

      // After update, should return a new object (immutable)
      act(() => {
        store.updateState('UPDATE_USER', { name: 'Jane' });
      });

      expect(result.current).toEqual({ name: 'Jane', age: 25 });
      expect(result.current).not.toBe(originalUser);
    });

    it('should return selected array and ensure immutability on updates', () => {
      const store = createSharedStore({
        initialState: { items: [1, 2, 3], count: 3 },
        events: ['ADD_ITEM', 'UPDATE_COUNT'],
        onEventChange: (state, event, payload) => {
          if (event === 'ADD_ITEM') return { ...state, items: [...state.items, payload], count: state.count + 1 };
          if (event === 'UPDATE_COUNT') return { ...state, count: payload };
          return state;
        },
      });

      const originalItems = store.getState().items;
      const { result } = renderHook(() =>
        useSubscribeStore(store, 'ADD_ITEM', (state) => state.items)
      );

      expect(result.current).toEqual([1, 2, 3]);
      // Initial render returns original reference
      expect(result.current).toBe(originalItems);

      // After update, should return a new array (immutable)
      act(() => {
        store.updateState('ADD_ITEM', 4);
      });

      expect(result.current).toEqual([1, 2, 3, 4]);
      expect(result.current).not.toBe(originalItems);
    });
  });

  describe('Event-specific subscription', () => {
    let store: ReturnType<typeof createSharedStore<{ count: number; name: string }, readonly ['UPDATE_COUNT', 'UPDATE_NAME']>>;

    beforeEach(() => {
      store = createSharedStore({
        initialState: { count: 0, name: 'test' },
        events: ['UPDATE_COUNT', 'UPDATE_NAME'] as const,
        onEventChange: (state, event, payload) => {
          if (event === 'UPDATE_COUNT') return { ...state, count: payload };
          if (event === 'UPDATE_NAME') return { ...state, name: payload };
          return state;
        },
      });
    });

    it('should only update when subscribed event is triggered', () => {
      const { result } = renderHook(() =>
        useSubscribeStore(store, 'UPDATE_COUNT', (state) => state.count)
      );

      expect(result.current).toBe(0);

      // Trigger the subscribed event
      act(() => {
        store.updateState('UPDATE_COUNT', 5);
      });

      expect(result.current).toBe(5);

      // Trigger a different event - should NOT update
      act(() => {
        store.updateState('UPDATE_NAME', 'updated');
      });

      expect(result.current).toBe(5); // Should remain unchanged
      expect(store.getState().name).toBe('updated'); // Store was updated, but hook didn't re-render
    });

    it('should update only for specific event even with same selector', () => {
      const countSelector = jest.fn((state) => state.count);
      const nameSelector = jest.fn((state) => state.name);

      const { result: countResult } = renderHook(() =>
        useSubscribeStore(store, 'UPDATE_COUNT', countSelector)
      );
      const { result: nameResult } = renderHook(() =>
        useSubscribeStore(store, 'UPDATE_NAME', nameSelector)
      );

      // Note: Selectors are called during initial setup
      expect(countSelector).toHaveBeenCalledTimes(1); // useReducer calls once for initial value
      expect(nameSelector).toHaveBeenCalledTimes(1);

      // Clear initial selector calls
      countSelector.mockClear();
      nameSelector.mockClear();

      act(() => {
        store.updateState('UPDATE_COUNT', 10);
      });

      expect(countSelector).toHaveBeenCalledTimes(2);
      expect(nameSelector).not.toHaveBeenCalled();
      expect(countResult.current).toBe(10);
      expect(nameResult.current).toBe('test'); // Unchanged

      countSelector.mockClear();
      nameSelector.mockClear();

      act(() => {
        store.updateState('UPDATE_NAME', 'new name');
      });

      expect(countSelector).not.toHaveBeenCalled();
      expect(nameSelector).toHaveBeenCalledTimes(2);
      expect(countResult.current).toBe(10); // Unchanged
      expect(nameResult.current).toBe('new name');
    });
  });

  describe('Selector function behavior', () => {
    type ComplexState = {
      user: { name: string; age: number; email: string };
      settings: { theme: string; notifications: boolean };
      items: { id: number; name: string }[];
    };
    let store: ReturnType<typeof createSharedStore<ComplexState, readonly ['UPDATE_USER', 'UPDATE_SETTINGS', 'UPDATE_ITEMS']>>;

    beforeEach(() => {
      store = createSharedStore({
        initialState: {
          user: { name: 'John', age: 25, email: 'john@test.com' },
          settings: { theme: 'dark', notifications: true },
          items: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]
        },
        events: ['UPDATE_USER', 'UPDATE_SETTINGS', 'UPDATE_ITEMS'] as const,
        onEventChange: (state, event, payload) => {
          if (event === 'UPDATE_USER') return { ...state, user: { ...state.user, ...payload } };
          if (event === 'UPDATE_SETTINGS') return { ...state, settings: { ...state.settings, ...payload } };
          if (event === 'UPDATE_ITEMS') return { ...state, items: payload };
          return state;
        },
      });
    });

    it('should handle complex selector transformations', () => {
      const { result } = renderHook(() =>
        useSubscribeStore(store, 'UPDATE_USER', (state) => ({
          fullName: `${state.user.name} (${state.user.age})`,
          isAdult: state.user.age >= 18
        }))
      );

      expect(result.current).toEqual({
        fullName: 'John (25)',
        isAdult: true
      });

      act(() => {
        store.updateState('UPDATE_USER', { name: 'Jane', age: 16 });
      });

      expect(result.current).toEqual({
        fullName: 'Jane (16)',
        isAdult: false
      });
    });

    it('should handle array transformations', () => {
      const { result } = renderHook(() =>
        useSubscribeStore(store, 'UPDATE_ITEMS', (state) =>
          state.items.map((item: { id: number; name: string }) => item.name).join(', ')
        )
      );

      expect(result.current).toBe('Item 1, Item 2');

      act(() => {
        store.updateState('UPDATE_ITEMS', [
          { id: 1, name: 'Updated Item 1' },
          { id: 2, name: 'Updated Item 2' },
          { id: 3, name: 'New Item 3' }
        ]);
      });

      expect(result.current).toBe('Updated Item 1, Updated Item 2, New Item 3');
    });

    it('should handle nested property selection', () => {
      const { result } = renderHook(() =>
        useSubscribeStore(store, 'UPDATE_SETTINGS', (state) => state.settings.theme)
      );

      expect(result.current).toBe('dark');

      act(() => {
        store.updateState('UPDATE_SETTINGS', { theme: 'light' });
      });

      expect(result.current).toBe('light');
    });

    it('should handle computed values', () => {
      const computedSelector = jest.fn((state) => {
        return {
          itemCount: state.items.length,
          hasItems: state.items.length > 0,
          firstItemName: state.items[0]?.name || 'No items'
        };
      });

      const { result } = renderHook(() =>
        useSubscribeStore(store, 'UPDATE_ITEMS', computedSelector)
      );

      expect(result.current).toEqual({
        itemCount: 2,
        hasItems: true,
        firstItemName: 'Item 1'
      });

      act(() => {
        store.updateState('UPDATE_ITEMS', []);
      });

      expect(result.current).toEqual({
        itemCount: 0,
        hasItems: false,
        firstItemName: 'No items'
      });
    });
  });

  describe('Subscription management', () => {
    it('should unsubscribe when hook unmounts', () => {
      const store = createSharedStore({
        initialState: { count: 0 },
        events: ['INCREMENT'],
        onEventChange: (state) => ({ ...state, count: state.count + 1 }),
      });

      // Spy on the unsubscribe function
      const mockUnsubscribe = jest.fn();
      jest.spyOn(store, 'subscribe').mockReturnValue(mockUnsubscribe);

      const { unmount } = renderHook(() =>
        useSubscribeStore(store, 'INCREMENT', (state) => state.count)
      );

      expect(store.subscribe).toHaveBeenCalledWith('INCREMENT', expect.any(Function));
      expect(mockUnsubscribe).not.toHaveBeenCalled();

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should not update after unmount', () => {
      const store = createSharedStore({
        initialState: { count: 0 },
        events: ['INCREMENT'],
        onEventChange: (state) => ({ ...state, count: state.count + 1 }),
      });

      const { result, unmount } = renderHook(() =>
        useSubscribeStore(store, 'INCREMENT', (state) => state.count)
      );

      expect(result.current).toBe(0);

      unmount();

      // Update store after unmount - should not cause issues
      act(() => {
        store.updateState('INCREMENT');
      });

      // Since the hook is unmounted, we can't check result.current
      // But this test ensures no errors are thrown
      expect(store.getState().count).toBe(1);
    });

    it('should handle multiple hooks with different events', () => {
      const store = createSharedStore({
        initialState: { count: 0, name: 'test' },
        events: ['UPDATE_COUNT', 'UPDATE_NAME'],
        onEventChange: (state, event, payload) => {
          if (event === 'UPDATE_COUNT') return { ...state, count: payload };
          if (event === 'UPDATE_NAME') return { ...state, name: payload };
          return state;
        },
      });

      const { result: countResult } = renderHook(() =>
        useSubscribeStore(store, 'UPDATE_COUNT', (state) => state.count)
      );
      const { result: nameResult } = renderHook(() =>
        useSubscribeStore(store, 'UPDATE_NAME', (state) => state.name)
      );

      expect(countResult.current).toBe(0);
      expect(nameResult.current).toBe('test');

      act(() => {
        store.updateState('UPDATE_COUNT', 42);
      });

      expect(countResult.current).toBe(42);
      expect(nameResult.current).toBe('test'); // Should remain unchanged

      act(() => {
        store.updateState('UPDATE_NAME', 'updated');
      });

      expect(countResult.current).toBe(42); // Should remain unchanged
      expect(nameResult.current).toBe('updated');
    });
  });

  describe('Edge cases and complex scenarios', () => {
    it('should handle selector returning primitives', () => {
      const store = createSharedStore({
        initialState: { count: 5 },
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => ({ ...state, count: payload }),
      });

      const { result } = renderHook(() =>
        useSubscribeStore(store, 'UPDATE', (state) => state.count > 10)
      );

      expect(result.current).toBe(false);

      act(() => {
        store.updateState('UPDATE', 15);
      });

      expect(result.current).toBe(true);
    });

    it('should handle selector returning null', () => {
      const store = createSharedStore({
        initialState: { user: null },
        events: ['SET_USER', 'CLEAR_USER'] as const,
        onEventChange: (state: { user: any }, event, payload) => {
          if (event === 'SET_USER') return { ...state, user: payload };
          if (event === 'CLEAR_USER') return { ...state, user: null };
          return state;
        },
      });

      const { result } = renderHook(() =>
        useSubscribeStore(store, 'SET_USER', (state) => state.user)
      );

      expect(result.current).toBe(null);

      act(() => {
        store.updateState('SET_USER', { name: 'John' });
      });

      expect(result.current).toEqual({ name: 'John' });

      // Now let's test CLEAR_USER by hooking to that event
      const { result: clearResult } = renderHook(() =>
        useSubscribeStore(store, 'CLEAR_USER', (state) => state.user)
      );

      act(() => {
        store.updateState('CLEAR_USER');
      });

      expect(clearResult.current).toBe(null);
    });

    it('should handle selector errors gracefully', () => {
      const store = createSharedStore({
        initialState: { data: { nested: 'value' } },
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => ({ ...state, data: payload }),
      });

      // Selector that might throw if data structure changes
      const riskySelector = (state: any) => {
        return state.data.nested.toUpperCase();
      };

      const { result } = renderHook(() =>
        useSubscribeStore(store, 'UPDATE', riskySelector)
      );

      expect(result.current).toBe('VALUE');

      // Update with data that will make selector throw
      expect(() => {
        act(() => {
          store.updateState('UPDATE', null);
        });
      }).toThrow();
    });

    it('should maintain referential equality for same computed values', () => {
      const store = createSharedStore({
        initialState: { items: [1, 2, 3] },
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => ({ ...state, items: payload }),
      });

      const { result, rerender } = renderHook(() =>
        useSubscribeStore(store, 'UPDATE', (state) => state.items.length)
      );

      const firstLength = result.current;
      expect(firstLength).toBe(3);

      // Rerender without state change
      rerender();

      expect(result.current).toBe(3);
      expect(result.current).toBe(firstLength); // Same reference for primitives
    });

    it('should handle rapid state updates', () => {
      const store = createSharedStore({
        initialState: { counter: 0 },
        events: ['INCREMENT'] as const,
        onEventChange: (state: { counter: number }) => ({ ...state, counter: state.counter + 1 }),
      });

      const selectorCallCount = jest.fn();
      const { result } = renderHook(() =>
        useSubscribeStore(store, 'INCREMENT', (state) => {
          selectorCallCount();
          return state.counter * 10;
        })
      );

      expect(result.current).toBe(0);
      // Selector is called once during initial setup (useReducer behavior)
      expect(selectorCallCount).toHaveBeenCalledTimes(1);

      selectorCallCount.mockClear();

      // Perform multiple rapid updates
      act(() => {
        for (let i = 0; i < 5; i++) {
          store.updateState('INCREMENT');
        }
      });

      expect(result.current).toBe(50); // 5 * 10
      expect(selectorCallCount).toHaveBeenCalledTimes(6);
    });

    it('should work with different store instances', () => {
      const store1 = createSharedStore({
        initialState: { value: 'store1' },
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => ({ ...state, value: payload }),
      });

      const store2 = createSharedStore({
        initialState: { value: 'store2' },
        events: ['UPDATE'],
        onEventChange: (state, event, payload) => ({ ...state, value: payload }),
      });

      const { result: result1 } = renderHook(() =>
        useSubscribeStore(store1, 'UPDATE', (state) => state.value)
      );
      const { result: result2 } = renderHook(() =>
        useSubscribeStore(store2, 'UPDATE', (state) => state.value)
      );

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
});
