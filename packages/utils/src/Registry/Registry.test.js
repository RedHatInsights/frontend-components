import registry, { getRegistry } from './Registry';

it('getRegistry', () => {
  const registry = getRegistry();
  expect(registry.reducers).toMatchObject({
    routerData: expect.any(Function),
  });
});

it('registry decorator', () => {
  const App = function () {};

  registry()(App);

  const instance = new App();

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
