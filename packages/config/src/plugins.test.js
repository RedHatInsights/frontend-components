import plugins from './plugins';

const HTML_WEBPACK = 5;
const COPYFILES = 6;
const REPLACE = 7;

describe('plugins generations, no option', () => {
    const enabledPlugins = plugins();

    it('should generate plugins', () => {
        expect(enabledPlugins.length).toBe(9);
    });

    it('should generate correct template path for HtmlWebpackPlugin', () => {
        expect(enabledPlugins[HTML_WEBPACK].options.template).toBe('/src/index.html');
    });

    it('should generate correct patterns for CopyFilesWebpackPlugin', () => {
        expect(enabledPlugins[COPYFILES].patterns[0]).toEqual({
            from: '/static/images',
            to: 'images'
        });
    });
});

/*
rootFolder,
appDeployment
    htmlPlugin,
    copyPlugin,
    replacePlugin*/
describe('rootFolder', () => {
    const enabledPlugins = plugins({ rootFolder: '/test/folder' });

    it('should generate correct template path for HtmlWebpackPlugin', () => {
        expect(enabledPlugins[HTML_WEBPACK].options.template).toBe('/test/folder/src/index.html');
    });

    it('should generate correct patterns for CopyFilesWebpackPlugin', () => {
        expect(enabledPlugins[COPYFILES].patterns[0]).toEqual({
            from: '/test/folder/static/images',
            to: 'images'
        });
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
    expect(enabledPlugins[HTML_WEBPACK].options.title).toBe('myTitle');
});

it('copyPlugin should update', () => {
    const enabledPlugins = plugins({ copyPlugin: [{}] });
    expect(enabledPlugins[COPYFILES].patterns.length).toBe(2);
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
