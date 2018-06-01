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

const reactRedux = {
    commonjs: 'react-redux',
    commonjs2: 'react-redux',
    amd: 'react-redux',
    root: 'ReactRedux',
};

module.exports = {
    externals: {
        react,
        redux,
        'patternfly-react': pfReact,
        'react-dom': reactDom,
        'react-redux': reactRedux
    },
};
