const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ProvidePlugin } = require('webpack');
const path = require('path');

module.exports = (env) => ({
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'eval-source-map',
    optimization: {
        minimize: process.env.NODE_ENV === 'production'
    },
    entry: {
        index: './src/index.tsx'
    },
    output: {
        filename: '[name].js',
    },
    module: {
        rules: [        {
            test: /\.(js|ts)x?$/,
            exclude: /node_modules/,
            use: {
              loader: 'swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'typescript',
                    tsx: true,
                  },
                },
              },
            },
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
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
            stream: require.resolve('stream-browserify'),
            zlib: require.resolve('browserify-zlib'),
            assert: require.resolve('assert/'),
            buffer: require.resolve('buffer/'),
            url: require.resolve('url/'),
            util: require.resolve('util/'),
            process: 'process/browser.js'
        }
    },
    plugins: [
        new (require('webpack').HotModuleReplacementPlugin)(),
        new MiniCssExtractPlugin({
            chunkFilename: '[name].css',
            filename: '[id].css'
        }),
        new (require('html-webpack-plugin'))({
            title: 'Playground',
            template: path.resolve(__dirname, './src/index.html')
        }),
        new ProvidePlugin({
            process: 'process/browser.js',
            Buffer: [ 'buffer', 'Buffer' ]
        }),
    ]
});