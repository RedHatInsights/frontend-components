import { createSharedStore, SharedStoreConfig } from './createSharedStore';

// Mock crypto.randomUUID for testing
const mockRandomUUID = jest.fn();
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: mockRandomUUID,
  },
});

describe('createSharedStore', () => {
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

  describe('Configuration validation', () => {
    it('should throw error when initialState is not provided', () => {
      const config = {
        // initialState is undefined (not provided)
        events: ['INCREMENT'],
        onEventChange: (state: any) => state,
      } as any;

      expect(() => createSharedStore(config)).toThrow('Initial state must be provided to create a shared store');
    });

    it('should throw error when events array is not provided', () => {
      const config = {
        initialState: { count: 0 },
        events: null,
        onEventChange: (state: any) => state,
      } as any;

      expect(() => createSharedStore(config)).toThrow('Events must be provided to create a shared store');
    });

    it('should throw error when onEventChange is not provided', () => {
      const config = {
        initialState: { count: 0 },
        events: ['INCREMENT'],
        onEventChange: null,
      } as any;

      expect(() => createSharedStore(config)).toThrow('onEventChange callback must be provided to create a shared store');
    });

    it('should throw error when events array is empty', () => {
      const config: SharedStoreConfig<{ count: number }, readonly []> = {
        initialState: { count: 0 },
        events: [],
        onEventChange: (state) => state,
      };

      expect(() => createSharedStore(config)).toThrow('At least one event must be defined to create a shared store');
    });

    it('should throw error when event array contains the reserved "*" string', () => {
      const config = {
        initialState: { count: 0 },
        events: ['INCREMENT', '*'],
        onEventChange: (state: any) => state,
      } as any;

      expect(() => createSharedStore(config)).toThrow('Event name "*" is reserved and cannot be used as an event name');
    });

    it('should throw error when event is not a string', () => {
      const config = {
        initialState: { count: 0 },
        events: ['INCREMENT', 123],
        onEventChange: (state: any) => state,
      } as any;

      expect(() => createSharedStore(config)).toThrow('Event names must be of type string, received number: "123"');
    });

    it('should accept valid string events', () => {
      const config: SharedStoreConfig<{ count: number }, readonly ['INCREMENT', 'DECREMENT']> = {
        initialState: { count: 0 },
        events: ['INCREMENT', 'DECREMENT'],
        onEventChange: (state, event) => {
          if (event === 'INCREMENT') return { ...state, count: state.count + 1 };
          if (event === 'DECREMENT') return { ...state, count: state.count - 1 };
          return state;
        },
      };

      expect(() => createSharedStore(config)).not.toThrow();
    });
  });

  describe('Store functionality', () => {
    let store: ReturnType<typeof createSharedStore>;
    let mockOnEventChange: jest.Mock;

    beforeEach(() => {
      mockOnEventChange = jest.fn((state, event, payload) => {
        if (event === 'INCREMENT') {
          return { ...state, count: state.count + (payload || 1) };
        }
        if (event === 'DECREMENT') {
          return { ...state, count: state.count - (payload || 1) };
        }
        if (event === 'SET') {
          return { ...state, count: payload };
        }
        return state;
      });

      const config: SharedStoreConfig<{ count: number }, readonly ['INCREMENT', 'DECREMENT', 'SET']> = {
        initialState: { count: 0 },
        events: ['INCREMENT', 'DECREMENT', 'SET'],
        onEventChange: mockOnEventChange,
      };

      store = createSharedStore(config);
    });

    it('should return initial state when getState is called', () => {
      expect(store.getState()).toEqual({ count: 0 });
    });

    it('should update state when updateState is called', () => {
      store.updateState('INCREMENT');
      expect(store.getState()).toEqual({ count: 1 });
      expect(mockOnEventChange).toHaveBeenCalledWith({ count: 0 }, 'INCREMENT', undefined);
    });

    it('should update state with payload when updateState is called with payload', () => {
      store.updateState('INCREMENT', 5);
      expect(store.getState()).toEqual({ count: 5 });
      expect(mockOnEventChange).toHaveBeenCalledWith({ count: 0 }, 'INCREMENT', 5);
    });

    it('should handle multiple state updates', () => {
      store.updateState('INCREMENT');
      store.updateState('INCREMENT', 2);
      store.updateState('DECREMENT');
      expect(store.getState()).toEqual({ count: 2 });
    });

    it('should call onEventChange with correct event name from array', () => {
      store.updateState('SET', 42);
      expect(mockOnEventChange).toHaveBeenCalledWith({ count: 0 }, 'SET', 42);
      expect(store.getState()).toEqual({ count: 42 });
    });
  });

  describe('Event subscription', () => {
    let store: ReturnType<typeof createSharedStore>;
    let mockCallback1: jest.Mock;
    let mockCallback2: jest.Mock;

    beforeEach(() => {
      const config: SharedStoreConfig<{ count: number }, readonly ['INCREMENT', 'DECREMENT']> = {
        initialState: { count: 0 },
        events: ['INCREMENT', 'DECREMENT'],
        onEventChange: (state, event, payload) => {
          if (event === 'INCREMENT') {
            return { ...state, count: state.count + (payload || 1) };
          }
          if (event === 'DECREMENT') {
            return { ...state, count: state.count - (payload || 1) };
          }
          return state;
        },
      };

      store = createSharedStore(config);
      mockCallback1 = jest.fn();
      mockCallback2 = jest.fn();
    });

    it('should call subscribed callback when specific event is triggered', () => {
      store.subscribe('INCREMENT', mockCallback1);
      store.updateState('INCREMENT');

      expect(mockCallback1).toHaveBeenCalledTimes(1);
    });

    it('should not call callback for different events', () => {
      store.subscribe('INCREMENT', mockCallback1);
      store.updateState('DECREMENT');

      expect(mockCallback1).not.toHaveBeenCalled();
    });

    it('should support multiple subscribers for the same event', () => {
      store.subscribe('INCREMENT', mockCallback1);
      store.subscribe('INCREMENT', mockCallback2);
      store.updateState('INCREMENT');

      expect(mockCallback1).toHaveBeenCalledTimes(1);
      expect(mockCallback2).toHaveBeenCalledTimes(1);
    });

    it('should return unsubscribe function that removes the subscription', () => {
      const unsubscribe = store.subscribe('INCREMENT', mockCallback1);
      store.updateState('INCREMENT');
      expect(mockCallback1).toHaveBeenCalledTimes(1);

      unsubscribe();
      store.updateState('INCREMENT');
      expect(mockCallback1).toHaveBeenCalledTimes(1); // Should not be called again
    });

    it('should handle unsubscribing non-existent subscription gracefully', () => {
      const unsubscribe = store.subscribe('INCREMENT', mockCallback1);
      unsubscribe();
      unsubscribe(); // Should not throw

      expect(() => unsubscribe()).not.toThrow();
    });

    it('should handle multiple unsubscribes', () => {
      const unsubscribe1 = store.subscribe('INCREMENT', mockCallback1);
      const unsubscribe2 = store.subscribe('INCREMENT', mockCallback2);

      store.updateState('INCREMENT');
      expect(mockCallback1).toHaveBeenCalledTimes(1);
      expect(mockCallback2).toHaveBeenCalledTimes(1);

      unsubscribe1();
      store.updateState('INCREMENT');
      expect(mockCallback1).toHaveBeenCalledTimes(1); // Should not be called again
      expect(mockCallback2).toHaveBeenCalledTimes(2); // Should still be called

      unsubscribe2();
      store.updateState('INCREMENT');
      expect(mockCallback1).toHaveBeenCalledTimes(1);
      expect(mockCallback2).toHaveBeenCalledTimes(2); // Should not be called again
    });

    it('should provide type safety for event names', () => {
      // This test demonstrates TypeScript type safety - these should be valid
      store.subscribe('INCREMENT', mockCallback1);
      store.subscribe('DECREMENT', mockCallback2);

      // TypeScript would prevent: store.subscribe('INVALID_EVENT', mockCallback1);
      store.updateState('INCREMENT');
      store.updateState('DECREMENT');

      expect(mockCallback1).toHaveBeenCalledTimes(1);
      expect(mockCallback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Global subscription (subscribeAll)', () => {
    let store: ReturnType<typeof createSharedStore>;
    let mockGlobalCallback1: jest.Mock;
    let mockGlobalCallback2: jest.Mock;
    let mockSpecificCallback: jest.Mock;

    beforeEach(() => {
      const config: SharedStoreConfig<{ count: number }, readonly ['INCREMENT', 'DECREMENT']> = {
        initialState: { count: 0 },
        events: ['INCREMENT', 'DECREMENT'],
        onEventChange: (state, event, payload) => {
          if (event === 'INCREMENT') {
            return { ...state, count: state.count + (payload || 1) };
          }
          if (event === 'DECREMENT') {
            return { ...state, count: state.count - (payload || 1) };
          }
          return state;
        },
      };

      store = createSharedStore(config);
      mockGlobalCallback1 = jest.fn();
      mockGlobalCallback2 = jest.fn();
      mockSpecificCallback = jest.fn();
    });

    it('should call global callback for any event', () => {
      store.subscribeAll(mockGlobalCallback1);

      store.updateState('INCREMENT');
      expect(mockGlobalCallback1).toHaveBeenCalledTimes(1);

      store.updateState('DECREMENT');
      expect(mockGlobalCallback1).toHaveBeenCalledTimes(2);
    });

    it('should support multiple global subscribers', () => {
      store.subscribeAll(mockGlobalCallback1);
      store.subscribeAll(mockGlobalCallback2);

      store.updateState('INCREMENT');
      expect(mockGlobalCallback1).toHaveBeenCalledTimes(1);
      expect(mockGlobalCallback2).toHaveBeenCalledTimes(1);
    });

    it('should call both specific and global callbacks', () => {
      store.subscribe('INCREMENT', mockSpecificCallback);
      store.subscribeAll(mockGlobalCallback1);

      store.updateState('INCREMENT');
      expect(mockSpecificCallback).toHaveBeenCalledTimes(1);
      expect(mockGlobalCallback1).toHaveBeenCalledTimes(1);

      store.updateState('DECREMENT');
      expect(mockSpecificCallback).toHaveBeenCalledTimes(1); // Should not be called for DECREMENT
      expect(mockGlobalCallback1).toHaveBeenCalledTimes(2); // Should be called for all events
    });

    it('should return unsubscribe function for global subscription', () => {
      const unsubscribe = store.subscribeAll(mockGlobalCallback1);

      store.updateState('INCREMENT');
      expect(mockGlobalCallback1).toHaveBeenCalledTimes(1);

      unsubscribe();
      store.updateState('DECREMENT');
      expect(mockGlobalCallback1).toHaveBeenCalledTimes(1); // Should not be called again
    });

    it('should handle unsubscribing global subscription gracefully', () => {
      const unsubscribe = store.subscribeAll(mockGlobalCallback1);
      unsubscribe();
      unsubscribe(); // Should not throw

      expect(() => unsubscribe()).not.toThrow();
    });
  });

  describe('TypeScript integration and type safety', () => {
    it('should provide proper type inference for events', () => {
      const config = {
        initialState: { value: 'initial' },
        events: ['LOAD', 'SUCCESS', 'ERROR'] as const,
        onEventChange: (state: { value: string }, event: 'LOAD' | 'SUCCESS' | 'ERROR', payload?: string) => {
          switch (event) {
            case 'LOAD':
              return { ...state, value: 'loading' };
            case 'SUCCESS':
              return { ...state, value: payload || 'success' };
            case 'ERROR':
              return { ...state, value: 'error' };
            default:
              return state;
          }
        },
      } as const;

      const store = createSharedStore(config);

      // These should all be type-safe
      store.updateState('LOAD');
      store.updateState('SUCCESS', 'data loaded');
      store.updateState('ERROR');

      store.subscribe('LOAD', () => {});
      store.subscribe('SUCCESS', () => {});
      store.subscribe('ERROR', () => {});

      expect(store.getState()).toEqual({ value: 'error' });
    });

    it('should work with const assertions for strict typing', () => {
      const events = ['USER_LOGIN', 'USER_LOGOUT', 'UPDATE_PROFILE'] as const;

      const config: SharedStoreConfig<
        { user: { name: string; loggedIn: boolean } },
        typeof events
      > = {
        initialState: { user: { name: '', loggedIn: false } },
        events: events,
        onEventChange: (state, event, payload) => {
          switch (event) {
            case 'USER_LOGIN':
              return { ...state, user: { name: payload, loggedIn: true } };
            case 'USER_LOGOUT':
              return { ...state, user: { name: '', loggedIn: false } };
            case 'UPDATE_PROFILE':
              return { ...state, user: { ...state.user, name: payload } };
            default:
              return state;
          }
        },
      };

      const store = createSharedStore(config);

      store.updateState('USER_LOGIN', 'John Doe');
      expect(store.getState().user).toEqual({ name: 'John Doe', loggedIn: true });

      store.updateState('UPDATE_PROFILE', 'Jane Doe');
      expect(store.getState().user).toEqual({ name: 'Jane Doe', loggedIn: true });

      store.updateState('USER_LOGOUT');
      expect(store.getState().user).toEqual({ name: '', loggedIn: false });
    });
  });

  describe('Edge cases and error handling', () => {
    let store: ReturnType<typeof createSharedStore>;

    beforeEach(() => {
      const config: SharedStoreConfig<{ count: number }, readonly ['INCREMENT']> = {
        initialState: { count: 0 },
        events: ['INCREMENT'],
        onEventChange: (state, event, payload) => ({ ...state, count: state.count + (payload || 1) }),
      };

      store = createSharedStore(config);
    });

    it('should maintain state consistency after errors in callbacks', () => {
      const errorCallback = jest.fn(() => {
        throw new Error('Callback error');
      });

      store.subscribe('INCREMENT', errorCallback);

      // The error in callback should not prevent state update
      expect(() => store.updateState('INCREMENT')).toThrow('Callback error');
      expect(store.getState()).toEqual({ count: 1 }); // State should still be updated
    });

    it('should handle rapid successive state updates', () => {
      const mockCallback = jest.fn();
      store.subscribe('INCREMENT', mockCallback);

      // Rapid updates
      for (let i = 0; i < 100; i++) {
        store.updateState('INCREMENT');
      }

      expect(store.getState()).toEqual({ count: 100 });
      expect(mockCallback).toHaveBeenCalledTimes(100);
    });

    it('should handle complex state objects', () => {
      const complexConfig: SharedStoreConfig<
        { user: { name: string; age: number }; settings: { theme: string } },
        readonly ['UPDATE_USER', 'UPDATE_THEME']
      > = {
        initialState: {
          user: { name: 'John', age: 25 },
          settings: { theme: 'light' },
        },
        events: ['UPDATE_USER', 'UPDATE_THEME'],
        onEventChange: (state, event, payload) => {
          if (event === 'UPDATE_USER') {
            return { ...state, user: { ...state.user, ...payload } };
          }
          if (event === 'UPDATE_THEME') {
            return { ...state, settings: { ...state.settings, theme: payload } };
          }
          return state;
        },
      };

      const complexStore = createSharedStore(complexConfig);

      complexStore.updateState('UPDATE_USER', { age: 26 });
      expect(complexStore.getState().user.age).toBe(26);
      expect(complexStore.getState().user.name).toBe('John'); // Should maintain other properties

      complexStore.updateState('UPDATE_THEME', 'dark');
      expect(complexStore.getState().settings.theme).toBe('dark');
    });

    it('should handle duplicate event names in array', () => {
      const configWithDuplicates = {
        initialState: { count: 0 },
        events: ['INCREMENT', 'INCREMENT'], // Duplicate events
        onEventChange: (state: any, event: any) => ({ ...state, count: state.count + 1 }),
      } as any;

      // Should still work, though duplicate events are redundant
      expect(() => createSharedStore(configWithDuplicates)).not.toThrow();

      const store = createSharedStore(configWithDuplicates);
      store.updateState('INCREMENT');
      expect(store.getState()).toEqual({ count: 1 });
    });
  });

  describe('Memory management', () => {
    it('should properly clean up subscriptions to prevent memory leaks', () => {
      const config: SharedStoreConfig<{ count: number }, readonly ['INCREMENT']> = {
        initialState: { count: 0 },
        events: ['INCREMENT'],
        onEventChange: (state) => ({ ...state, count: state.count + 1 }),
      };

      const store = createSharedStore(config);
      const unsubscribeFunctions: (() => void)[] = [];

      // Create many subscriptions
      for (let i = 0; i < 100; i++) {
        const unsubscribe = store.subscribe('INCREMENT', jest.fn());
        unsubscribeFunctions.push(unsubscribe);
      }

      // Unsubscribe all
      unsubscribeFunctions.forEach(unsub => unsub());

      // This should work without any issues and callbacks should not be called
      const mockCallback = jest.fn();
      store.subscribe('INCREMENT', mockCallback);
      store.updateState('INCREMENT');

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should handle unsubscribing from non-existent events', () => {
      const config: SharedStoreConfig<{ count: number }, readonly ['INCREMENT']> = {
        initialState: { count: 0 },
        events: ['INCREMENT'],
        onEventChange: (state) => ({ ...state, count: state.count + 1 }),
      };

      const store = createSharedStore(config);
      const unsubscribe = store.subscribe('INCREMENT', jest.fn());

      // Unsubscribe multiple times should be safe
      unsubscribe();
      expect(() => unsubscribe()).not.toThrow();
      expect(() => unsubscribe()).not.toThrow();
    });
  });
});
