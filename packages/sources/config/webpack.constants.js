module.exports = {
    externals: [
        /^@patternfly\/.*/,
        /^@data-driven-forms\/react-form-renderer\/.*/,
        /^@data-driven-forms\/pf4-component-mapper\/.*/,
        {
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
            '@redhat-cloud-services/frontend-components': '@redhat-cloud-services/frontend-components',
            '@data-driven-forms/pf4-component-mapper': '@data-driven-forms/pf4-component-mapper',
            '@data-driven-forms/react-form-renderer': '@data-driven-forms/react-form-renderer',
            'prop-types': 'prop-types',
            react: 'react',
            'react-redux': 'react-redux',
            'react-dom': 'react-dom',
            'react-router-dom': {
                commonjs: 'react-router-dom',
                commonjs2: 'react-router-dom',
                amd: 'react-router-dom',
                root: 'ReactRouterDOM'
            },
            urijs: 'urijs',
            classnames: 'classnames'
        }
    ]
};
