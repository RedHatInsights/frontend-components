module.exports = {
    externals: [
        /^@patternfly\/.*/,
        {
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
            '@patternfly/react-table': {
                commonjs: '@patternfly/react-table',
                commonjs2: '@patternfly/react-table',
                amd: '@patternfly/react-table',
                root: 'PFReactTable'
            },
            '@redhat-cloud-services/frontend-components-utilities': '@redhat-cloud-services/frontend-components-utilities',
            '@redhat-cloud-services/frontend-components': '@redhat-cloud-services/frontend-components',
            '@redhat-cloud-services/frontend-components-notifications': '@redhat-cloud-services/frontend-components-notifications',
            '@redhat-cloud-services/frontend-components-remediations': '@redhat-cloud-services/frontend-components-remediations',
            '@redhat-cloud-services/host-inventory-client': '@redhat-cloud-services/host-inventory-client',
            'prop-types': 'prop-types',
            'react-content-loader': 'react-content-loader',
            'react-router-dom': 'react-router-dom',
            'react-dom': 'react-dom',
            redux: 'redux',
            axios: 'axios',
            react: 'react'
        }
    ]
};
