const { getDirectories } = require('../../../config/utils');

const entries = {
    ...getDirectories('./src/Charts', 'charts')
};

module.exports = {
    entries,
    externals: {
        d3: 'd3',
        c3: 'c3',
        '@redhat-cloud-services/frontend-components-utilities': {
            commonjs: '@redhat-cloud-services/frontend-components-utilities',
            commonjs2: '@redhat-cloud-services/frontend-components-utilities',
            amd: '@redhat-cloud-services/frontend-components-utilities',
            root: 'FECUtilities'
        },
        'react-router-dom': {
            commonjs: 'react-router-dom',
            commonjs2: 'react-router-dom',
            amd: 'react-router-dom',
            root: 'ReactRouterDOM',
        },
        'prop-types': {
            commonjs: 'prop-types',
            commonjs2: 'prop-types',
            amd: 'prop-types',
            root: 'propTypes',
        },
        'react-dom': 'react-dom',
        react: 'react',
        classnames: 'classnames'
    },
};
