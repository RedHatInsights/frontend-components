import chromeState, { UpdateEvents } from './chromeState';

describe('chromeState', () => {
  let state: ReturnType<typeof chromeState>;
  const lastVisitedPayload = [
    { pathname: 'foo', title: 'Foo title', bundle: 'foo-title' },
    { pathname: 'bar', title: 'Bar title', bundle: 'bar-title' },
  ];
  beforeEach(() => {
    state = chromeState();
  });

  test('should correctly initialize', () => {
    expect(state).toEqual({
      getState: expect.any(Function),
      setIdentity: expect.any(Function),
      setLastVisited: expect.any(Function),
      setFavoritePages: expect.any(Function),
      setVisitedBundles: expect.any(Function),
      subscribe: expect.any(Function),
      unsubscribe: expect.any(Function),
      update: expect.any(Function),
    });
  });

  test('should correctly update lastVisited data via "update API"', () => {
    state.update(UpdateEvents.lastVisited, {
      lastVisitedPages: lastVisitedPayload,
    });
    expect(state.getState().lastVisitedPages).toEqual(lastVisitedPayload);
  });

  test('should correctly update lastVisited data via dedicated callback', () => {
    state.setLastVisited(lastVisitedPayload);
    expect(state.getState().lastVisitedPages).toEqual(lastVisitedPayload);
  });

  test('should correctly update favrite pages data via dedicated callback', () => {
    state.setFavoritePages([{ pathname: 'favorite', favorite: true }]);
    expect(state.getState().favoritePages).toEqual([{ pathname: 'favorite', favorite: true }]);
  });

  test('should subscribe to lastVisited event and trigger update callback', () => {
    const onUpdateSpy = jest.fn();
    state.subscribe(UpdateEvents.lastVisited, onUpdateSpy);
    expect(onUpdateSpy).toHaveBeenCalledTimes(1);

    state.update(UpdateEvents.lastVisited, { lastVisitedPages: lastVisitedPayload });
    expect(onUpdateSpy).toHaveBeenCalledTimes(2);
  });

  test('should not call update callback on unsubscribed clients', () => {
    const onUpdateSpyOne = jest.fn();
    const onUpdateSpyTwo = jest.fn();

    const id = state.subscribe(UpdateEvents.lastVisited, onUpdateSpyOne);
    state.subscribe(UpdateEvents.lastVisited, onUpdateSpyTwo);

    expect(onUpdateSpyOne).toHaveBeenCalledTimes(1);
    expect(onUpdateSpyTwo).toHaveBeenCalledTimes(1);

    state.unsubscribe(id, UpdateEvents.lastVisited);

    state.update(UpdateEvents.lastVisited, { lastVisitedPages: lastVisitedPayload });
    expect(onUpdateSpyOne).toHaveBeenCalledTimes(1);
    expect(onUpdateSpyTwo).toHaveBeenCalledTimes(2);
  });

  test('should log an error if trying unsubscribe non existing client', () => {
    const errorSpy = jest.spyOn(global.console, 'error').mockImplementationOnce(() => undefined /**silently fail in test */);

    state.unsubscribe(123, UpdateEvents.lastVisited);

    expect(errorSpy).toHaveBeenCalledWith('Trying to unsubscribe client outside of the range!');
  });
});
