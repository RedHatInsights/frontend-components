const config = require('./src/config');
const plugins = require('./src/plugins');
const { sync } = require('glob');

const gitRevisionPlugin = new (require('git-revision-webpack-plugin'))({
    branch: true
});
const betaBranches = ['master', 'qa-beta', 'ci-beta', 'prod-beta', 'main', 'devel'];
const akamaiBranches = ['prod-beta', 'prod-stable'];

const getAppEntry = (rootFolder, isProd) => {
    // Use entry-dev if it exists
    if (!isProd) {
      const entries = sync('src/entry-dev.{js,jsx,ts,tsx}', { cwd: rootFolder });
      if (entries.length > 1) {
          console.warn('Found multiple entry-dev files. Using', entries[0]);
      }
      if (entries.length > 0) {
          return `rootFolder/${entries[0]}`;
      }
    }

    const entries = sync('src/entry.{js,jsx,ts,tsx}', { cwd: rootFolder });
    if (entries.length > 1) {
        console.warn('Found multiple entry files. Using', entries[0]);
    }

    return `rootFolder/${entries[0]}`;
};

module.exports = (configurations) => {
    configurations.isProd = configurations.isProd || process.env.NODE_ENV === 'production';
    const isProd = configurations.isProd;
    const { insights } = require(`${configurations.rootFolder}/package.json`);
    const gitBranch = process.env.TRAVIS_BRANCH || process.env.BRANCH || gitRevisionPlugin.branch();
    const appDeployment = configurations.deployment || ((isProd && betaBranches.includes(gitBranch)) ?
        'beta/apps' :
        'apps');

    const publicPath = `/${appDeployment}/${insights.appname}/`;
    const appEntry = configurations.appEntry || getAppEntry(configurations.rootFolder, isProd);
    const generateSourceMaps = !akamaiBranches.includes(gitBranch);

    /* eslint-disable no-console */
    if (configurations.debug) {
        console.log('~~~Using variables~~~');
        console.log(`Root folder: ${configurations.rootFolder}`);
        console.log(`Current branch: ${gitBranch}`);
        !generateSourceMaps && console.log(`Source map generation for "${gitBranch}" deployment has been disabled.`)
        console.log(`Beta branches: ${betaBranches}`);
        console.log(`Using deployments: ${appDeployment}`);
        console.log(`Public path: ${publicPath}`);
        console.log(`App entry: ${appEntry}`);
        console.log(`Use proxy: ${configurations.useProxy ? 'true' : 'false'}`);
        !configurations.useProxy && console.log('You can use webpack proxy (instead of using insights-proxy) by setting "useProxy". Check config documentation to see more details.');
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
            appName: insights.appname
        }),
        plugins: plugins({
            ...configurations,
            generateSourceMaps,
            appDeployment,
            insights,
            publicPath
        })
    };
};
