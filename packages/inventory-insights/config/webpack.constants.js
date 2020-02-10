module.exports = {
    externals: [
        /^@patternfly\/.*/,
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
            '@patternfly/react-table': {
                commonjs: '@patternfly/react-table',
                commonjs2: '@patternfly/react-table',
                amd: '@patternfly/react-table',
                root: 'PFReactTable'
            },
            '@redhat-cloud-services/frontend-components': '@redhat-cloud-services/frontend-components',
            '@redhat-cloud-services/frontend-components-notifications': '@redhat-cloud-services/frontend-components-notifications',
            '@redhat-cloud-services/frontend-components-remediations': '@redhat-cloud-services/frontend-components-remediations',
            'prop-types': 'prop-types',
            react: 'react',
            'react-redux': 'react-redux',
            urijs: 'urijs',
            classnames: 'classnames',
            dot: 'dot',
            'sanitize-html': 'sanitize-html',
            marked: 'marked',
            'react-content-loader': 'react-content-loader'
        }
    ]
};
