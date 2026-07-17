import React from 'react';
import ReducerRegistry from '../ReducerRegistry';
import registry, { getRegistry } from './Registry';

it('getRegistry', () => {
  const registry = getRegistry();
  expect(registry.reducers).toMatchObject({
    routerData: expect.any(Function),
  });
});

it('registry decorator', () => {
  class App extends React.Component {
    render() {
      return 'app';
    }
  }

  registry()(App);

  interface ObjectWithRegistry extends App {
    getRegistry: () => ReducerRegistry<any> | void;
  }

  const instance = new App({}) as ObjectWithRegistry;

  expect(instance.getRegistry()).toMatchObject({
    reducers: { routerData: expect.any(Function) },
  });
});

it('should dispatch action', () => {
  const registry = getRegistry();
  registry.store.dispatch({
    type: '@@INSIGHTS-CORE/NAVIGATION',
    payload: {
      some: 'data',
    },
  });

  expect(registry.store.getState()).toMatchObject({
    routerData: {
      some: 'data',
    },
  });
});
