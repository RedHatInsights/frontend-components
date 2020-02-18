const path = require('path');

module.exports = (env) => ({
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'source-map',
    optimization: {
        minimize: process.env.NODE_ENV === 'production'
    },
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /src\/.*\.js$/,
            exclude: /(node_modules|bower_components)/i,
            use: [{ loader: 'source-map-loader' }, { loader: 'babel-loader' }]
        }, {
            test: /\.s?[ac]ss$/,
            use: [ 'style-loader', 'css-loader', 'sass-loader' ]
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
    plugins: [
        new(require('write-file-webpack-plugin'))(),
        new(require('webpack').HotModuleReplacementPlugin)(),
        new(require('lodash-webpack-plugin'))({ currying: true, flattening: true, placeholders: true, paths: true }),
        new(require('html-webpack-plugin'))({
            title: 'Playground',
            template: path.resolve(__dirname, './src/index.html')
        })
    ]
});
