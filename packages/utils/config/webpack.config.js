const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');
const { buildPlugins } = require('./webpack.plugins.js');

module.exports = (env) => ({
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'source-map',
    optimization: {
        minimize: process.env.NODE_ENV === 'production'
    },
    entry: {
        ReducerRegistry: './src/ReducerRegistry.js',
        helpers: './src/helpers.js',
        MiddlewareListener: './src/MiddlewareListener.js',
        Registry: './src/Registry.js',
        Deffered: './src/Deffered.js',
        RouterParams: './src/RouterParams.js',
        interceptors: './src/interceptors.js',
        debounce: './src/debounce.js',
        Styles: './src/Utilities.scss'
    },
    output: {
        filename: 'files/[name].js',
        path: resolve(__dirname, '../'),
        library: 'CloudServicesComponents[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [{
            test: /src\/.*\.js$/,
            exclude: /(node_modules|bower_components)/i,
            use: [{ loader: 'source-map-loader' }, { loader: 'babel-loader' }]
        }, {
            test: /\.s?[ac]ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'sass-loader'
                }
            ]
        }, {
            test: /\.(woff(2)?|ttf|jpg|png|eot|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }]
        }]
    },
    externals: [
        /^@patternfly\/.*/, {
            '@patternfly/react-core': {
                commonjs: '@patternfly/react-core',
                commonjs2: '@patternfly/react-core',
                amd: '@patternfly/react-core',
                root: 'PFReactCore'
            },
            'react-router-dom': 'react-router-dom',
            'react-content-loader': 'react-content-loader',
            react: 'react',
            'react-dom': 'react-dom',
            'react-redux': 'react-redux',
            axios: 'axios',
            'awesome-debounce-promise': 'awesome-debounce-promise'
        }],
    ...buildPlugins(env)
});
