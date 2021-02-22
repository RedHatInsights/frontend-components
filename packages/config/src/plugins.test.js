import plugins from './plugins';

const HTML_WEBPACK = 3;
const REPLACE = 4;

describe('plugins generations, no option', () => {
    const enabledPlugins = plugins();

    it('should generate plugins', () => {
        expect(enabledPlugins.length).toBe(7);
    });

    it('should generate correct template path for HtmlWebpackPlugin', () => {
        expect(enabledPlugins[HTML_WEBPACK].userOptions.template).toBe('/src/index.html');
    });
});

describe('rootFolder', () => {
    const enabledPlugins = plugins({ rootFolder: '/test/folder' });

    it('should generate correct template path for HtmlWebpackPlugin', () => {
        expect(enabledPlugins[HTML_WEBPACK].userOptions.template).toBe('/test/folder/src/index.html');
    });
});

describe('appDeployment', () => {
    const enabledPlugins = plugins({ appDeployment: '/test/folder' });

    it('should replace correct string', () => {
        enabledPlugins[REPLACE].replace(
            { html: 'string @@env' },
            (_, { html }) => expect(html).toBe('string /test/folder')
        );
    });
});

it('htmlPlugin should update', () => {
    const enabledPlugins = plugins({ htmlPlugin: { title: 'myTitle' } });
    expect(enabledPlugins[HTML_WEBPACK].userOptions.title).toBe('myTitle');
});

it('replacePlugin should update', () => {
    const enabledPlugins = plugins({ replacePlugin: [
        {
            pattern: '@@another',
            replacement: 'test-string'
        }
    ] });
    enabledPlugins[REPLACE].replace(
        { html: '@@another string @@env' },
        (_, { html }) => expect(html).toBe('test-string string ')
    );
});
