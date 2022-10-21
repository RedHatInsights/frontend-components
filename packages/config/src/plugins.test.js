import plugins from './plugins';

const HTML_WEBPACK = 2;
const REPLACE = 3;
const DEFINE_PLUGIN = 4;

describe('plugins generations, no option', () => {
  const enabledPlugins = plugins({ useChromeTemplate: false });

  it('should generate plugins', () => {
    expect(enabledPlugins.length).toBe(8);
  });

  it('should generate plugins with sourceMaps', () => {
    const enabledPlugins = plugins({ generateSourceMaps: true, useChromeTemplate: false });
    expect(enabledPlugins.length).toBe(9);
  });

  it('should generate correct template path for HtmlWebpackPlugin', () => {
    expect(enabledPlugins[HTML_WEBPACK].userOptions.template).toBe('/src/index.html');
  });
});

describe('rootFolder', () => {
  const enabledPlugins = plugins({ rootFolder: '/test/folder', useChromeTemplate: false });

  it('should generate correct template path for HtmlWebpackPlugin', () => {
    expect(enabledPlugins[HTML_WEBPACK].userOptions.template).toBe('/test/folder/src/index.html');
  });
});

describe('appDeployment', () => {
  const enabledPlugins = plugins({ appDeployment: '/test/folder', useChromeTemplate: false });

  it('should replace correct string', () => {
    enabledPlugins[REPLACE].replace({ html: 'string @@env' }, (_, { html }) => expect(html).toBe('string /test/folder'));
  });
});

it('htmlPlugin should update', () => {
  const enabledPlugins = plugins({ htmlPlugin: { title: 'myTitle' }, useChromeTemplate: false });
  expect(enabledPlugins[HTML_WEBPACK].userOptions.title).toBe('myTitle');
});

it('replacePlugin should update', () => {
  const enabledPlugins = plugins({
    useChromeTemplate: false,
    replacePlugin: [
      {
        pattern: '@@another',
        replacement: 'test-string',
      },
    ],
  });
  enabledPlugins[REPLACE].replace({ html: '@@another string @@env' }, (_, { html }) => expect(html).toBe('test-string string '));
});

it('definePlugin should have default replace of CRC_APP_NAME', () => {
  const enabledPlugins = plugins({
    useChromeTemplate: false,
    insights: { appname: 'test_app' },
  });
  expect(enabledPlugins[DEFINE_PLUGIN].definitions.CRC_APP_NAME).toBe('"test_app"');
});

it('definePlugin should update', () => {
  const enabledPlugins = plugins({
    useChromeTemplate: false,
    definePlugin: {
      SOME_VAR: JSON.stringify('test_val'),
    },
  });
  expect(enabledPlugins[DEFINE_PLUGIN].definitions.SOME_VAR).toBe('"test_val"');
});
