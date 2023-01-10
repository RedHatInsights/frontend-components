/*
    port,
    publicPath,
    appEntry,
    rootFolder,
    https*/
import config from './config';

const configBuilder = (c) => config({ rootFolder: '', ...c });

describe('should create dummy config with no options', () => {
  const { mode, optimization, entry, output, devServer } = config({ rootFolder: '' });

  const { mode: prodMode } = configBuilder({ mode: 'production' });
  test('mode', () => {
    expect(mode).toBe('development');
  });

  test('prodMode', () => {
    expect(prodMode).toBe('production');
  });

  test('optimization', () => {
    expect(optimization).toEqual(undefined);
  });

  test('entry', () => {
    expect(entry).toEqual({ App: undefined });
  });

  test('output', () => {
    expect(output).toEqual({
      filename: expect.stringMatching(/js\/\[name\]\.\[fullhash\]\.js/),
      path: '/dist',
      publicPath: undefined,
      chunkFilename: expect.stringMatching(/js\/\[name\]\.\[fullhash\]\.js/),
    });
  });

  test('devServer', () => {
    expect(devServer).toEqual({
      onBeforeSetupMiddleware: expect.any(Function),
      onListening: expect.any(Function),
      static: {
        directory: '/dist',
      },
      https: false,
      host: '0.0.0.0',
      port: 8002,
      hot: false,
      liveReload: true,
      allowedHosts: 'all',
      historyApiFallback: {
        rewrites: [
          { from: /^\/api/, to: '/404.html' },
          { from: /^(\/beta)?\/config/, to: '/404.html' },
        ],
        verbose: false,
        disableDotRule: true,
      },
      client: {},
      devMiddleware: {
        writeToDisk: true,
      },
    });
  });
});

describe('rootFolder', () => {
  const { output, devServer } = configBuilder({ rootFolder: '/some' });
  test('output', () => {
    expect(output.path).toBe('/some/dist');
  });

  test('devServer', () => {
    expect(devServer.static.directory).toBe('/some/dist');
  });
});

describe('module rules', () => {
  test('length', () => {
    const { module } = configBuilder({ appEntry: 'testEntry', appName: 'someName' });
    expect(module.rules.length).toBe(6);
  });

  test('first to be chrome-render-loader', () => {
    const { module } = configBuilder({ appEntry: 'testEntry', appName: 'someName' });
    expect(new RegExp(module.rules[0].rules).test('testEntry')).toBe(true);
    expect(module.rules[0].options.skipChrome2).toBe(false);
  });

  test('first to be chrome-render-loader', () => {
    const { module } = configBuilder({ appEntry: 'testEntry', appName: 'someName', skipChrome2: true });
    expect(module.rules[0].options.skipChrome2).toBe(true);
  });
});

test('appEntry correctly set', () => {
  const { entry } = configBuilder({ appEntry: 'testEntry' });
  expect(entry).toEqual({ App: 'testEntry' });
});

describe('publicPath', () => {
  const { output } = configBuilder({ publicPath: 'test-value' });

  test('output', () => {
    expect(output.publicPath).toBe('test-value');
  });
});

describe('port', () => {
  const { devServer } = configBuilder({ port: 1000 });

  test('devServer', () => {
    expect(devServer.port).toBe(1000);
  });
});

test('https', () => {
  const { devServer } = configBuilder({ https: true });
  expect(devServer.https).toBe(true);
});

test('noFileHash', () => {
  const { output } = configBuilder({ useFileHash: false });
  expect(output.filename).toBe('js/[name].js');
});
