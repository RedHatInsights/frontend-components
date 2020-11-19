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
        devServer
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
            filename: 'js/[name].[chunkhash].js',
            path: '/dist',
            publicPath: undefined,
            chunkFilename: 'js/[name].[chunkhash].js'
        });
    });

    test('devServer', () => {
        expect(devServer).toEqual({
            contentBase: '/dist',
            contentBasePublicPath: undefined,
            hot: true,
            port: 8002,
            https: false,
            inline: true,
            disableHostCheck: true,
            historyApiFallback: true,
            writeToDisk: true
        });
    });
});

describe('rootFolder', () => {
    const {
        output,
        devServer
    } = configBuilder({ rootFolder: '/some' });
    test('output', () => {
        expect(output.path).toBe('/some/dist');
    });

    test('devServer', () => {
        expect(devServer.contentBase).toBe('/some/dist');
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
        output
    } = configBuilder({ publicPath: 'test-value' });

    test('output', () => {
        expect(output.publicPath).toBe('test-value');
    });
});

describe('port', () => {
    const {
        devServer
    } = configBuilder({ port: 1000 });

    test('devServer', () => {
        expect(devServer.port).toBe(1000);
    });
});

test('https', () => {
    const {
        devServer
    } = configBuilder({ https: true });
    expect(devServer.https).toBe(true);
});
