import React from 'react';
import { render, act } from '@testing-library/react';
import { createSharedStore, useGetState, useSubscribeStore } from './index';

// Mock crypto.randomUUID for testing
const mockRandomUUID = jest.fn();
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: mockRandomUUID,
  },
});

describe('Shared Store Integration Tests - Render Optimization', () => {
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

  describe('Event-specific subscription render optimization', () => {
    let store: ReturnType<typeof createSharedStore<{ count: number; name: string; theme: string; }, readonly ['UPDATE_COUNT', 'UPDATE_NAME', 'UPDATE_THEME']>>;
    let countRenderCount: number;
    let nameRenderCount: number;
    let globalRenderCount: number;

    beforeEach(() => {
      // Reset render counters
      countRenderCount = 0;
      nameRenderCount = 0;
      globalRenderCount = 0;

      // Create store with multiple state properties
      store = createSharedStore({
        initialState: { count: 0, name: 'initial', theme: 'light' },
        events: ['UPDATE_COUNT', 'UPDATE_NAME', 'UPDATE_THEME'] as const,
        onEventChange: (state, event, payload) => {
          if (event === 'UPDATE_COUNT') return { ...state, count: payload };
          if (event === 'UPDATE_NAME') return { ...state, name: payload };
          if (event === 'UPDATE_THEME') return { ...state, theme: payload };
          return state;
        },
      });
    });

    // Component that only subscribes to count changes
    const CountComponent = () => {
      countRenderCount++;
      const count = useSubscribeStore(store, 'UPDATE_COUNT', (state) => state.count);
      return <div data-testid="count-component">{count}</div>;
    };

    // Component that only subscribes to name changes
    const NameComponent = () => {
      nameRenderCount++;
      const name = useSubscribeStore(store, 'UPDATE_NAME', (state) => state.name);
      return <div data-testid="name-component">{name}</div>;
    };

    // Component that subscribes to all changes (using useGetState)
    const GlobalComponent = () => {
      globalRenderCount++;
      const state = useGetState(store);
      return <div data-testid="global-component">{JSON.stringify(state)}</div>;
    };

    it('should only re-render components subscribed to specific events', () => {
      const TestApp = () => (
        <div>
          <CountComponent />
          <NameComponent />
          <GlobalComponent />
        </div>
      );

      render(<TestApp />);

      // Initial render: all components render once
      expect(countRenderCount).toBe(1);
      expect(nameRenderCount).toBe(1);
      expect(globalRenderCount).toBe(1);

      // Update count - should only re-render CountComponent and GlobalComponent
      act(() => {
        store.updateState('UPDATE_COUNT', 42);
      });

      expect(countRenderCount).toBe(2); // Re-rendered
      expect(nameRenderCount).toBe(1); // NOT re-rendered (optimization working!)
      expect(globalRenderCount).toBe(2); // Re-rendered (listens to all changes)

      // Update name - should only re-render NameComponent and GlobalComponent
      act(() => {
        store.updateState('UPDATE_NAME', 'updated');
      });

      expect(countRenderCount).toBe(2); // NOT re-rendered (optimization working!)
      expect(nameRenderCount).toBe(2); // Re-rendered
      expect(globalRenderCount).toBe(3); // Re-rendered (listens to all changes)

      // Update theme - should only re-render GlobalComponent (no components subscribe to this event)
      act(() => {
        store.updateState('UPDATE_THEME', 'dark');
      });

      expect(countRenderCount).toBe(2); // NOT re-rendered
      expect(nameRenderCount).toBe(2); // NOT re-rendered
      expect(globalRenderCount).toBe(4); // Re-rendered (listens to all changes)
    });

    it('should optimize renders with selector functions', () => {
      let userNameRenderCount = 0;
      let userAgeRenderCount = 0;
      let userStatsRenderCount = 0;

      const userStore = createSharedStore({
        initialState: {
          user: { name: 'John', age: 25, email: 'john@test.com' },
          settings: { theme: 'light' },
        },
        events: ['UPDATE_USER', 'UPDATE_SETTINGS'] as const,
        onEventChange: (state, event, payload) => {
          if (event === 'UPDATE_USER') return { ...state, user: { ...state.user, ...payload } };
          if (event === 'UPDATE_SETTINGS') return { ...state, settings: { ...state.settings, ...payload } };
          return state;
        },
      });

      // Component that only cares about user name
      const UserNameComponent = () => {
        userNameRenderCount++;
        const userName = useSubscribeStore(userStore, 'UPDATE_USER', (state) => state.user.name);
        return <div data-testid="user-name">{userName}</div>;
      };

      // Component that only cares about user age
      const UserAgeComponent = () => {
        userAgeRenderCount++;
        const userAge = useSubscribeStore(userStore, 'UPDATE_USER', (state) => state.user.age);
        return <div data-testid="user-age">{userAge}</div>;
      };

      // Component that calculates user stats (derived data)
      const UserStatsComponent = () => {
        userStatsRenderCount++;
        const stats = useSubscribeStore(userStore, 'UPDATE_USER', (state) => ({
          isAdult: state.user.age >= 18,
          initials: state.user.name.split(' ').map(n => n[0]).join(''),
        }));
        return <div data-testid="user-stats">{JSON.stringify(stats)}</div>;
      };

      const TestApp = () => (
        <div>
          <UserNameComponent />
          <UserAgeComponent />
          <UserStatsComponent />
        </div>
      );

      render(<TestApp />);

      // Initial render
      expect(userNameRenderCount).toBe(1);
      expect(userAgeRenderCount).toBe(1);
      expect(userStatsRenderCount).toBe(1);

      // Update user data - all user components should re-render
      act(() => {
        userStore.updateState('UPDATE_USER', { name: 'Jane Doe', age: 30 });
      });

      expect(userNameRenderCount).toBe(2);
      expect(userAgeRenderCount).toBe(2);
      expect(userStatsRenderCount).toBe(2);

      // Update settings - NO user components should re-render
      act(() => {
        userStore.updateState('UPDATE_SETTINGS', { theme: 'dark' });
      });

      expect(userNameRenderCount).toBe(2); // No re-render!
      expect(userAgeRenderCount).toBe(2); // No re-render!
      expect(userStatsRenderCount).toBe(2); // No re-render!
    });

    it('should handle multiple components subscribing to the same event', () => {
      let counter1RenderCount = 0;
      let counter2RenderCount = 0;
      let counter3RenderCount = 0;

      const counterStore = createSharedStore({
        initialState: { count: 0, multiplier: 1 },
        events: ['INCREMENT', 'SET_MULTIPLIER'] as const,
        onEventChange: (state, event, payload) => {
          if (event === 'INCREMENT') return { ...state, count: state.count + (payload || 1) };
          if (event === 'SET_MULTIPLIER') return { ...state, multiplier: payload };
          return state;
        },
      });

      // Multiple components subscribing to the same event
      const Counter1 = () => {
        counter1RenderCount++;
        const count = useSubscribeStore(counterStore, 'INCREMENT', (state) => state.count);
        return <div data-testid="counter1">{count}</div>;
      };

      const Counter2 = () => {
        counter2RenderCount++;
        const count = useSubscribeStore(counterStore, 'INCREMENT', (state) => state.count);
        return <div data-testid="counter2">Count: {count}</div>;
      };

      // Component subscribing to different event
      const MultiplierComponent = () => {
        counter3RenderCount++;
        const multiplier = useSubscribeStore(counterStore, 'SET_MULTIPLIER', (state) => state.multiplier);
        return <div data-testid="multiplier">{multiplier}x</div>;
      };

      const TestApp = () => (
        <div>
          <Counter1 />
          <Counter2 />
          <MultiplierComponent />
        </div>
      );

      render(<TestApp />);

      // Initial render
      expect(counter1RenderCount).toBe(1);
      expect(counter2RenderCount).toBe(1);
      expect(counter3RenderCount).toBe(1);

      // Increment count - should re-render Counter1 and Counter2, but NOT MultiplierComponent
      act(() => {
        counterStore.updateState('INCREMENT', 1);
      });

      expect(counter1RenderCount).toBe(2);
      expect(counter2RenderCount).toBe(2);
      expect(counter3RenderCount).toBe(1); // No re-render!

      // Set multiplier - should re-render MultiplierComponent, but NOT counters
      act(() => {
        counterStore.updateState('SET_MULTIPLIER', 2);
      });

      expect(counter1RenderCount).toBe(2); // No re-render!
      expect(counter2RenderCount).toBe(2); // No re-render!
      expect(counter3RenderCount).toBe(2);
    });

    it('should demonstrate performance difference between useGetState and useSubscribeStore', () => {
      let getStateRenderCount = 0;
      let subscribeStoreRenderCount = 0;

      const perfStore = createSharedStore({
        initialState: {
          criticalData: 'important',
          nonCriticalData: 'not important',
          metadata: { lastUpdated: Date.now() }
        },
        events: ['UPDATE_CRITICAL', 'UPDATE_NON_CRITICAL', 'UPDATE_METADATA'] as const,
        onEventChange: (state, event, payload) => {
          if (event === 'UPDATE_CRITICAL') return { ...state, criticalData: payload };
          if (event === 'UPDATE_NON_CRITICAL') return { ...state, nonCriticalData: payload };
          if (event === 'UPDATE_METADATA') return { ...state, metadata: { ...state.metadata, ...payload } };
          return state;
        },
      });

      // Component using useGetState (re-renders on ANY change)
      const GetStateComponent = () => {
        getStateRenderCount++;
        const state = useGetState(perfStore);
        return <div data-testid="get-state">{state.criticalData}</div>;
      };

      // Component using useSubscribeStore (only re-renders on specific events)
      const SubscribeStoreComponent = () => {
        subscribeStoreRenderCount++;
        const criticalData = useSubscribeStore(perfStore, 'UPDATE_CRITICAL', (state) => state.criticalData);
        return <div data-testid="subscribe-store">{criticalData}</div>;
      };

      const TestApp = () => (
        <div>
          <GetStateComponent />
          <SubscribeStoreComponent />
        </div>
      );

      render(<TestApp />);

      // Initial render
      expect(getStateRenderCount).toBe(1);
      expect(subscribeStoreRenderCount).toBe(1);

      // Update critical data - both should re-render
      act(() => {
        perfStore.updateState('UPDATE_CRITICAL', 'very important');
      });

      expect(getStateRenderCount).toBe(2);
      expect(subscribeStoreRenderCount).toBe(2);

      // Update non-critical data - only GetStateComponent should re-render
      act(() => {
        perfStore.updateState('UPDATE_NON_CRITICAL', 'still not important');
      });

      expect(getStateRenderCount).toBe(3); // Re-rendered
      expect(subscribeStoreRenderCount).toBe(2); // NOT re-rendered (optimization!)

      // Update metadata - only GetStateComponent should re-render
      act(() => {
        perfStore.updateState('UPDATE_METADATA', { lastUpdated: Date.now() + 1000 });
      });

      expect(getStateRenderCount).toBe(4); // Re-rendered
      expect(subscribeStoreRenderCount).toBe(2); // NOT re-rendered (optimization!)

      // Final tally: useGetState caused 4 renders, useSubscribeStore only 2 renders
      // This demonstrates the performance benefit of event-specific subscriptions
    });
  });
});
