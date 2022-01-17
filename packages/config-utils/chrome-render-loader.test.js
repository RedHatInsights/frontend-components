import chromeRenderLoader from './chrome-render-loader';

jest.mock('loader-utils', () => ({
  getOptions: jest.fn().mockImplementation((that) => {
    return that.options;
  }),
}));

describe('chromeRenderLoader', () => {
  beforeAll(() => {
    global.insights = {
      chrome: {
        isChrome2: true,
      },
    };
  });
  test('add correct class', () => {
    const result = chromeRenderLoader.bind({
      options: {
        appName: 'someName',
      },
    })('something');
    expect(result.includes(`document.getElementById('root').classList.add('someName')`)).toBe(true);
  });

  test('calculate isChrome2 to be true', () => {
    const result = chromeRenderLoader.bind({
      options: {
        appName: 'someName',
      },
    })('something');
    expect(eval(result.match(/\((!.*(?=;))/)[0])).toBe(true);
  });

  test('calculate isChrome2 to be false', () => {
    const result = chromeRenderLoader.bind({
      options: {
        appName: 'someName',
        skipChrome2: true,
      },
    })('something');
    expect(eval(result.match(/\((!.*(?=;))/)[0])).toBe(false);
  });
});
