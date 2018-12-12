module.exports = {
  presets: ['babel-preset-env', 'babel-preset-react', 'babel-preset-es2017', 'babel-preset-es2015'].map(require.resolve),
  plugins: [
      [require.resolve('babel-plugin-transform-runtime'), {
          polyfill: false,
          regenerator: true
      }],
      require.resolve('babel-plugin-syntax-dynamic-import'),
      require.resolve('babel-plugin-lodash'),
      require.resolve('babel-plugin-transform-object-rest-spread'),
      require.resolve('babel-plugin-add-react-displayname'),
      require.resolve('babel-plugin-transform-react-display-name'),
      require.resolve('babel-plugin-transform-class-properties'),
  ],
  ignore: 'node_modules'
}
