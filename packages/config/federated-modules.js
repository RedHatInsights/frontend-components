const { resolve } = require('path');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = ({
    root,
    exposes,
    shared = [],
    debug,
    moduleName
}) => {
    const { dependencies, insights } = require(resolve(root, './package.json')) || {};
    const appName = moduleName || (insights && insights.appname);

    const sharedDeps = [
        { lodash: { singleton: true, ...dependencies.lodash && { requiredVersion: dependencies.lodash } } },
        { axios: { singleton: true, ...dependencies.axios && { requiredVersion: dependencies.axios } } },
        ...dependencies.redux ? [{ redux: { singleton: true, requiredVersion: dependencies.redux } }] : [],
        ...dependencies.react ? [{ react: { singleton: true, requiredVersion: dependencies.react } }] : [],
        ...dependencies['react-dom'] ? [{ 'react-dom': { singleton: true, requiredVersion: dependencies['react-dom'] } }] : [],
        ...dependencies['react-router-dom'] ? [{ 'react-router-dom': { singleton: true, requiredVersion: dependencies['react-router-dom'] } }] : [],
        ...dependencies['@patternfly/react-table'] ? [{ '@patternfly/react-table': { singleton: true, requiredVersion: dependencies['@patternfly/react-table'] } }] : [],
        ...dependencies['@patternfly/react-core'] ? [{ '@patternfly/react-core': { singleton: true, requiredVersion: dependencies['@patternfly/react-core'] } }] : [],
        ...dependencies['@patternfly/react-core'] ? [{ '@patternfly/react-icons': { singleton: true, requiredVersion: dependencies['@patternfly/react-icons'] } }] : [],
        {
            '@patternfly/react-tokens': {
                singleton: true,
                ...dependencies['@patternfly/react-tokens'] && {
                    requiredVersion: dependencies['@patternfly/react-tokens']
                }
            }
        },
        ...dependencies['@redhat-cloud-services/frontend-components'] ? [{
            '@redhat-cloud-services/frontend-components': {
                singleton: true,
                requiredVersion: dependencies['@redhat-cloud-services/frontend-components']
            }
        }] : [],
        ...dependencies['@redhat-cloud-services/frontend-components-utilities'] ? [{
            '@redhat-cloud-services/frontend-components-utilities': {
                singleton: true,
                requiredVersion: dependencies['@redhat-cloud-services/frontend-components-utilities']
            }
        }] : [],
        ...dependencies['@redhat-cloud-services/frontend-components-notifications'] ? [{
            '@redhat-cloud-services/frontend-components-notifications': {
                singleton: true,
                requiredVersion: dependencies['@redhat-cloud-services/frontend-components-notifications']
            }
        }] : [],
        ...dependencies['react-redux'] ? [{ 'react-redux': { singleton: true, requiredVersion: dependencies['react-redux'] } }] : [],
        ...dependencies['redux-promise-middleware'] ? [{ 'redux-promise-middleware': { singleton: true, requiredVersion: dependencies['redux-promise-middleware'] }
        }] : []
    ];

    if (debug) {
        console.log('Using package at path: ', resolve(root, './package.json'));
        console.log('Using appName: ', appName);
        console.log(`Using ${exposes ? 'custom' : 'default'} exposes`);
        console.log('Number of custom shared modules is: ', shared.length);
        console.log('Number of default shared modules is: ', sharedDeps.length);
    }

    return new ModuleFederationPlugin({
        name: appName,
        filename: `${appName}.[chunkhash].js`,
        library: { type: 'var', name: appName },
        exposes: {
            ...exposes || {
                './RootApp': resolve(root, './src/AppEntry')
            }
        },
        shared: [
            ...sharedDeps,
            ...shared
        ]
    });
};
