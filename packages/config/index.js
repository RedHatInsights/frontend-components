const config = require('./src/config');
const plugins = require('./src/plugins');
const fs = require('fs');

const gitRevisionPlugin = new (require('git-revision-webpack-plugin'))({
    branch: true
});
const betaBranches = ['master', 'qa-beta', 'ci-beta', 'prod-beta', 'main', 'devel'];

const getAppEntry = (rootFolder, isProd) => {
    const jsAppEntry = isProd ? `${rootFolder}/src/entry.js` : `${rootFolder}/src/entry-dev.js`;
    const tsAppEntry = isProd ? `${rootFolder}/src/entry.tsx` : `${rootFolder}/src/entry-dev.tsx`;
    if (fs.existsSync(jsAppEntry)) {
        return jsAppEntry;
    }

    if (fs.existsSync(tsAppEntry)) {
        return tsAppEntry;
    }

    return jsAppEntry;
};

module.exports = (configurations) => {
    const isProd = configurations.isProd || process.env.NODE_ENV === 'production';
    const { insights } = require(`${configurations.rootFolder}/package.json`);
    const gitBranch = process.env.TRAVIS_BRANCH || process.env.BRANCH || gitRevisionPlugin.branch();
    const appDeployment = configurations.deployment || ((isProd && betaBranches.includes(gitBranch)) ?
        'beta/apps' :
        'apps');

    const publicPath = `/${appDeployment}/${insights.appname}/`;
    const appEntry = configurations.appEntry || getAppEntry(configurations.rootFolder, isProd);
    const standalonePath = configurations.standalonePath || require.resolve('insights-standalone/package.json').replace('package.json', '');

    /* eslint-disable no-console */
    if (configurations.debug) {
        console.log('~~~Using variables~~~');
        console.log(`Root folder: ${configurations.rootFolder}`);
        console.log(`Is production: ${isProd}`);
        console.log(`Current branch: ${gitBranch}`);
        console.log(`Beta branches: ${betaBranches}`);
        console.log(`Using deployments: ${appDeployment}`);
        console.log(`Public path: ${publicPath}`);
        console.log(`App entry: ${appEntry}`);
        console.log('~~~~~~~~~~~~~~~~~~~~~');
    }
    /* eslint-enable no-console */

    return {
        config: config({
            ...configurations,
            appDeployment,
            insights,
            publicPath,
            appEntry,
            appName: insights.appname,
        }),
        plugins: plugins({
            ...configurations,
            appDeployment,
            insights,
            publicPath,
            standalonePath
        })
    };
};
