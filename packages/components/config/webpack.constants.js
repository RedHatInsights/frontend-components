const { getDirectories } = require('../../../config/utils');

const entries = {
    ...getDirectories('./src/Components', 'components')
};

module.exports = {
    entries,
    externals: {
        '@redhat-cloud-services/frontend-components-utilities': {
            commonjs: '@redhat-cloud-services/frontend-components-utilities',
            commonjs2: '@redhat-cloud-services/frontend-components-utilities',
            amd: '@redhat-cloud-services/frontend-components-utilities',
            root: 'FECUtilities'
        },
        '@patternfly/react-icons': {
            commonjs: '@patternfly/react-icons',
            commonjs2: '@patternfly/react-icons',
            amd: '@patternfly/react-icons',
            root: 'PFReactIcons'
        },
        '@patternfly/react-core': {
            commonjs: '@patternfly/react-core',
            commonjs2: '@patternfly/react-core',
            amd: '@patternfly/react-core',
            root: 'PFReactCore'
        },
        'react-router-dom': {
            commonjs: 'react-router-dom',
            commonjs2: 'react-router-dom',
            amd: 'react-router-dom',
            root: 'ReactRouterDOM',
        },
        'prop-types': 'prop-types',
        'react-dom': 'react-dom',
        react: 'react',
        classnames: 'classnames',
        'react-redux': 'react-redux',
        'react-content-loader': 'react-content-loader'
    },
};
