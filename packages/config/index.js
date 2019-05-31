const config = require('./src/config');
const plugins = require('./src/plugins');
const gitRevisionPlugin = new (require('git-revision-webpack-plugin'))({
    branch: true
});
const betaBranhces = ['master', 'qa-beta', 'ci-beta', 'prod-beta'];

module.exports = (configurations) => {
    const { insights } = require(`${configurations.rootFolder}/package.json`);
    const gitBranch = process.env.TRAVIS_BRANCH || process.env.BRANCH || gitRevisionPlugin.branch();
    const appDeployment = (process.env.NODE_ENV === 'production' && betaBranhces.includes(gitBranch)) ?
        'beta/apps' :
        'apps';

    const publicPath = `/${appDeployment}/${insights.appname}/`;
    const appEntry = process.env.NODE_ENV === 'production' ?
        `${configurations.rootFolder}/src/entry.js` :
        `${configurations.rootFolder}/src/entry-dev.js`;

    /* eslint-disable no-console */
    if (configurations.debug) {
        console.log('~~~Using variables~~~');
        console.log(`Root folder: ${configurations.root}`);
        console.log(`Current branch: ${gitBranch}`);
        console.log(`Beta branches: ${betaBranhces}`);
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
            appEntry
        }),
        plugins: plugins({
            ...configurations,
            appDeployment,
            insights,
            publicPath
        }),
    }
}
