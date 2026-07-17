import MiddlewareListener from './MiddlewareListener';

test('should create empty listeners', () => {
  const mwListener = new MiddlewareListener();
  expect(mwListener.listeners.size).toBe(0);
});

describe('basic functions', () => {
  const mwListener = new MiddlewareListener();
  let listener: any;

  test('should add new listener', () => {
    listener = mwListener.addNew(listener);
    expect(mwListener.listeners.size).toBe(1);
  });

  test('should remove listener', () => {
    listener();
    expect(mwListener.listeners.size).toBe(0);
  });
});

describe('bubble actions', () => {
  let mwListener: any;
  const mockedNext = jest.fn();
  const mockedAction = { type: 'something', payload: { data: 'some data' } };

  beforeEach(() => {
    mwListener = new MiddlewareListener();
  });

  test('should stop', () => {
    mwListener.addNew({
      on: 'something',
      callback: ({ data, preventBubble }: { data: any; preventBubble: any }) => {
        expect(data).toEqual({ data: 'some data' });
        preventBubble();
      },
    });
    mwListener.getMiddleware()()(mockedNext)(mockedAction);
    expect(mockedNext.mock.calls[0][0].type).toBe('@@config/action-stopped');
  });

  test('should NOT stop', () => {
    mwListener.addNew({
      on: 'something',
      callback: ({ data }: { data: any }) => {
        expect(data).toEqual({ data: 'some data' });
      },
    });
    mwListener.getMiddleware()()(mockedNext)(mockedAction);
    expect(mockedNext.mock.calls[1][0].type).toBe('something');
  });

  test('should return listeners', () => {
    const callback = jest.fn();
    mwListener.addNew({
      on: 'test-listener',
      callback,
    });
    expect(mwListener.getListeners().size).toBe(1);
    expect(mwListener.getListeners().values().next().value.on).toBe('test-listener');
  });
});
