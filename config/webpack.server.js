const config = require('./webpack.common.js');
const glob = require('glob');
const fs = require('fs');

/**
 * This creates AsynImports.js which exports an object with async import calls
 * for all js files in the app that need to be imported asynchronously.
 * This is useful for debugging and code readability.
 *
 * @type {Function}
 */
// const asyncImports = () => {
//     const cfiles = glob.sync(`${config.paths.dumbComponents}/**/*.js`);
//     const components = cfiles.map(c => {
//         const dir = c.substr(config.paths.src.length);
//         const array = c.split('/');
//         const name = array[array.length - 1].substr(0, array[array.length - 1].length - 3);
//         const code = `    '.${dir}': () => import(/* webpackChunkName: "${name}", webpackMode: "lazy" */ '.${dir}')`;
//         return c === cfiles[cfiles.length - 1] ? `${code}\n` : `${code},\n`;
//     });
//
//     const code = `export default {\n${components.join('')}}`;
//     fs.writeFile(`${config.paths.src}/AsyncImports.js`, code);
//
// };

module.exports = {
    devServer: {
        allowedHosts: ['host.docker.internal'],
        contentBase: config.paths.public,
        port: 8002,
        historyApiFallback: true
    }
};
