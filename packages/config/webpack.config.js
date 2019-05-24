const { resolve } = require('path');

module.exports = () => ({
    mode: 'development',
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, './'),
        library: 'CloudServicesComponents[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [{
            test: /src\/.*\.js$/,
            exclude: /(node_modules|bower_components)/i,
            use: [{ loader: 'source-map-loader' }, { loader: 'babel-loader' }]
        }]
    }
});
