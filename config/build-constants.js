const { lstatSync, readdirSync } = require('fs')
const { join, resolve, extname } = require('path')

const react = {
    commonjs: 'react',
    commonjs2: 'react',
    amd: 'react',
    root: 'React',
};
  
const reactDom = {
    commonjs: 'react-dom',
    commonjs2: 'react-dom',
    amd: 'react-dom',
    root: 'ReactDOM',
};

const pfReact = {
    commonjs: 'patternfly-react',
    commonjs2: 'patternfly-react',
    amd: 'patternfly-react',
    root: 'PFReact',
};

const redux = {
    commonjs: 'redux',
    commonjs2: 'redux',
    amd: 'redux',
    root: 'Redux',
};

const createReactClass = {
    commonjs: 'create-react-class',
    commonjs2: 'create-react-class',
    amd: 'create-react-class',
    root: 'ReactCreateClass',
}

const reactRedux = {
    commonjs: 'react-redux',
    commonjs2: 'react-redux',
    amd: 'react-redux',
    root: 'ReactRedux',
};

const isDirectory = source => lstatSync(source).isDirectory();

const getDirectories = (source, dest) =>
  readdirSync(source)
    .map(name => {
      const key = `${dest}/${name}`;
      return {
          [key]: './' + join(source, `${name}/index.js`)
        }
    })
    .reduce((acc, curr) => ({...acc, ...curr}), {})
const entries = {
    'Utilities/ReducerRegistry': './src/Utilities/ReducerRegistry.js',
    'Utilities/MiddlewareListener': './src/Utilities/MiddlewareListener.js',
    ...getDirectories('./src/PresentationalComponents', 'components'),
    ...getDirectories('./src/SmartComponents', 'components')
}

module.exports = {
    entries,
    externals: {
        react,
        redux,
        'create-react-class': createReactClass,
        'patternfly-react': pfReact,
        'react-dom': reactDom,
        'react-redux': reactRedux,
        classnames: 'classnames'
    },
};
