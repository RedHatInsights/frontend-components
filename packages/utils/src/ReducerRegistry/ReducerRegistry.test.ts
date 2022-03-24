import ReducerRegistry, { applyReducerHash, dispatchActionsToStore } from './ReducerRegistry';

it('should create empty store', () => {
  const reducerRegistry = new ReducerRegistry();
  expect(reducerRegistry).toMatchObject({
    store: {
      dispatch: expect.any(Function),
      subscribe: expect.any(Function),
      getState: expect.any(Function),
      replaceReducer: expect.any(Function),
    },
    reducers: {},
  });

  expect(reducerRegistry.store.getState()).toMatchObject({});
});

it('should create store with prefilled state', () => {
  const reducerRegistry = new ReducerRegistry({ some: 'value' });
  expect(reducerRegistry.getStore().getState()).toMatchObject({ some: 'value' });
});

it('should register new reducer', () => {
  const reducerRegistry = new ReducerRegistry();
  reducerRegistry.register({
    basic: (state = {}) => state,
  });
  expect(reducerRegistry).toMatchObject({
    reducers: {
      basic: expect.any(Function),
    },
  });
});

it('should register and unregister new reducer', () => {
  const reducerRegistry = new ReducerRegistry();
  reducerRegistry.register({
    basic: (state = {}) => state,
  });
  const unregister = reducerRegistry.register({
    another: (state = {}) => state,
  });
  unregister();
  expect(reducerRegistry).toMatchObject({
    reducers: {
      basic: expect.any(Function),
    },
  });
});

describe('applyReducerHash', () => {
  it('should apply changes', () => {
    const changedState = applyReducerHash({
      one: (state = {}) => ({ ...state, changed: 'f' }),
    })(undefined, { type: 'one' });
    expect(changedState).toMatchObject({ changed: 'f' });
  });

  it('should NOT apply changes', () => {
    const changedState = applyReducerHash(
      {
        one: (state = {}) => ({ ...state, changed: 'f' }),
      },
      {}
    )({ default: 'not changed' }, { type: 'two' });
    expect(changedState).toMatchObject({ default: 'not changed' });
  });
});

describe('dispatchActionsToStore', () => {
  const dispatch = jest.fn();
  it('basic action', () => {
    const actions = dispatchActionsToStore(
      {
        one: () => ({ type: 'test' }),
      },
      { dispatch }
    );
    actions.one();
    expect(dispatch).toHaveBeenLastCalledWith({ type: 'test' });
  });

  it('action with payload', () => {
    const actions = dispatchActionsToStore(
      {
        one: () => ({ type: 'test' }),
        two: (data) => ({ type: 'another', payload: data }),
      },
      { dispatch }
    );
    actions.two({ rows: [] });
    expect(dispatch).toHaveBeenLastCalledWith({
      type: 'another',
      payload: {
        rows: [],
      },
    });
  });
});
