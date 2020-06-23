/*
port,
    publicPath,
    appEntry,
    rootFolder,
    https*/
import configBuilder from './config';

describe('should create dummy config with no options', () => {
    const {
        mode,
        optimization,
        entry,
        output,
        devServer,
        serve
    } = configBuilder();

    const { mode: prodMode } = configBuilder({ mode: 'production' });
    test('mode', () => {
        expect(mode).toBe('development');
    });

    test('prodMode', () => {
        expect(prodMode).toBe('production');
    });

    test('optimization', () => {
        expect(optimization).toEqual({
            minimize: false,
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    reactVendor: {
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        name: 'reactvendor'
                    },
                    pfVendor: {
                        test: /[\\/]node_modules[\\/](@patternfly)[\\/]/,
                        name: 'pfVendor'
                    },
                    rhcsVendor: {
                        test: /[\\/]node_modules[\\/](@redhat-cloud-services)[\\/]/,
                        name: 'rhcsVendor'
                    },
                    vendor: {
                        test: /[\\/]node_modules[\\/](!react-dom)(!react)(!@patternfly)(!@redhat-cloud-services)[\\/]/,
                        name: 'vendor'
                    }
                }
            }
        });
    });

    test('entry', () => {
        expect(entry).toEqual({ App: undefined });
    });

    test('output', () => {
        expect(output).toEqual({
            filename: 'js/[name].js',
            path: '/dist',
            publicPath: undefined,
            chunkFilename: 'js/[name].js'
        });
    });

    test('devServer', () => {
        expect(devServer).toEqual({
            contentBase: '/dist',
            hot: true,
            port: 8002,
            https: false,
            inline: true,
            disableHostCheck: true,
            historyApiFallback: true
        });
    });

    test('serve', () => {
        expect(serve).toMatchObject({
            content: '/dist',
            port: 8002,
            dev: {
                publicPath: undefined
            }
        });
    });

    test('serve add', () => {
        const use = jest.fn();
        serve.add({ use });
        expect(use).toHaveBeenCalled();
    });
});

describe('rootFolder', () => {
    const {
        output,
        devServer,
        serve
    } = configBuilder({ rootFolder: '/some' });
    test('output', () => {
        expect(output.path).toBe('/some/dist');
    });

    test('devServer', () => {
        expect(devServer.contentBase).toBe('/some/dist');
    });

    test('serve', () => {
        expect(serve.content).toBe('/some/dist');
    });
});

test('appEntry correctly set', () => {
    const {
        entry
    } = configBuilder({ appEntry: 'testEntry' });
    expect(entry).toEqual({ App: 'testEntry' });
});

describe('publicPath', () => {
    const {
        output,
        serve
    } = configBuilder({ publicPath: 'test-value' });

    test('output', () => {
        expect(output.publicPath).toBe('test-value');
    });

    test('serve', () => {
        expect(serve.dev).toEqual({ publicPath: 'test-value' });
    });
});

describe('port', () => {
    const {
        devServer,
        serve
    } = configBuilder({ port: 1000 });

    test('devServer', () => {
        expect(devServer.port).toBe(1000);
    });

    test('serve', () => {
        expect(serve.port).toBe(1000);
    });
});

test('https', () => {
    const {
        devServer
    } = configBuilder({ https: true });
    expect(devServer.https).toBe(true);
});
