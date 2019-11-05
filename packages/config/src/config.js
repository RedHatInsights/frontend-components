const history = require('connect-history-api-fallback');
const convert = require('koa-connect');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = ({
    port,
    publicPath,
    appEntry,
    rootFolder,
    https
} = {}) => {
    return {
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        devtool: 'source-map',
        optimization: {
            minimize: process.env.NODE_ENV === 'production',
            splitChunks: {
                cacheGroups: {
                    vendors: false,
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'initial'
                    }
                }
            }
        },
        entry: {
            App: appEntry
        },
        output: {
            filename: 'js/[name].js',
            path: `${rootFolder || ''}/dist`,
            publicPath,
            chunkFilename: 'js/[name].js'
        },
        module: {
            rules: [{
                test: /src\/.*\.js$/,
                exclude: /(node_modules|bower_components)/i,
                use: [{ loader: 'source-map-loader' }, { loader: 'babel-loader' }, { loader: 'eslint-loader' }]
            }, {
                test: /src\/.*\.tsx?$/,
                loader: 'ts-loader',
                exclude: /(node_modules)/i
            }, {
                test: /\.s?[ac]ss$/,
                use: [
                    process.env.NODE_ENV === 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
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
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            }]
        },
        resolve: {
            extensions: [ '.ts', '.tsx', '.js', '.scss' ]
        },
        devServer: {
            contentBase: `${rootFolder || ''}/dist`,
            hot: true,
            port: port || 8002,
            https: https || false,
            inline: true,
            disableHostCheck: true,
            historyApiFallback: true
        },
        serve: {
            content: `${rootFolder || ''}/dist`,
            port: port || 8002,
            dev: {
                publicPath
            },
            // https://github.com/webpack-contrib/webpack-serve/blob/master/docs/addons/history-fallback.config.js
            add: app => app.use(convert(history({})))
        }
    };
};
