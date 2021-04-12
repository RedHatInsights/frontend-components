const { resolve } = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const jsVarName = require('./src/jsVarName');

module.exports = ({
    root,
    exposes,
    shared = [],
    debug,
    moduleName,
    useFileHash = true,
    exclude = []
}) => {
    const { dependencies, insights } = require(resolve(root, './package.json')) || {};
    const appName = moduleName || (insights && jsVarName(insights.appname));

    let sharedDeps = [
        { lodash: { ...dependencies.lodash && { requiredVersion: dependencies.lodash } } },
        { axios: { ...dependencies.axios && { requiredVersion: dependencies.axios } } },
        ...dependencies.redux ? [{ redux: { requiredVersion: dependencies.redux } }] : [],
        ...dependencies.react ? [{ react: { singleton: true, requiredVersion: dependencies.react } }] : [],
        ...dependencies['react-dom'] ? [{ 'react-dom': { singleton: true, requiredVersion: dependencies['react-dom'] } }] : [],
        ...dependencies['react-router-dom'] ? [{ 'react-router-dom': { requiredVersion: dependencies['react-router-dom'] } }] : [],
        ...dependencies['@patternfly/react-table'] ? [{ '@patternfly/react-table': { requiredVersion: dependencies['@patternfly/react-table'] } }] : [],
        ...dependencies['@patternfly/react-core'] ? [{ '@patternfly/react-core': { requiredVersion: dependencies['@patternfly/react-core'] } }] : [],
        ...dependencies['@patternfly/react-icons'] ? [{ '@patternfly/react-icons': { requiredVersion: dependencies['@patternfly/react-icons'] } }] : [],
        {
            '@patternfly/react-tokens': {
                ...dependencies['@patternfly/react-tokens'] && {
                    requiredVersion: dependencies['@patternfly/react-tokens']
                }
            }
        },
        ...dependencies['@redhat-cloud-services/frontend-components'] ? [{
            '@redhat-cloud-services/frontend-components': {
                requiredVersion: dependencies['@redhat-cloud-services/frontend-components']
            }
        }] : [],
        ...dependencies['@redhat-cloud-services/frontend-components-utilities'] ? [{
            '@redhat-cloud-services/frontend-components-utilities': {
                requiredVersion: dependencies['@redhat-cloud-services/frontend-components-utilities']
            }
        }] : [],
        ...dependencies['@redhat-cloud-services/frontend-components-notifications'] ? [{
            '@redhat-cloud-services/frontend-components-notifications': {
                requiredVersion: dependencies['@redhat-cloud-services/frontend-components-notifications']
            }
        }] : [],
        ...dependencies['react-redux'] ? [{ 'react-redux': { requiredVersion: dependencies['react-redux'] } }] : [],
        ...dependencies['redux-promise-middleware'] ? [{ 'redux-promise-middleware': { requiredVersion: dependencies['redux-promise-middleware'] }
        }] : []
    ];

    sharedDeps = sharedDeps.filter(entry => !exclude.includes(Object.keys(entry)[0]));

    if (debug) {
        console.log('Using package at path: ', resolve(root, './package.json'));
        console.log('Using appName: ', appName);
        console.log(`Using ${exposes ? 'custom' : 'default'} exposes`);
        console.log('Number of custom shared modules is: ', shared.length);
        console.log('Number of default shared modules is: ', sharedDeps.length);
        if (exclude.length > 0) {
            console.log('Excluding default packages', exclude);
        }
    }

    return new ModuleFederationPlugin({
        name: appName,
        filename: `${appName}${useFileHash ? '.[chunkhash]' : ''}.js`,
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
