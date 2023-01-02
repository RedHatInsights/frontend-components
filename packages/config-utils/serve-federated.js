const path = require('path');
const fs = require('fs');
const concurrently = require('concurrently');

function federate(argv, cwd) {
  let configPath = argv.config || './node_modules/@redhat-cloud-services/frontend-components-config/src/scripts/prod.webpack.config.js';
  const WEBPACK_PATH = path.resolve(cwd, './node_modules/.bin/webpack');
  const HTTP_SERVER_PATH = path.resolve(cwd, './node_modules/.bin/http-server');
  if (typeof configPath !== 'string') {
    console.error('Invalid webpack config path!');
    process.exit(1);
  }

  configPath = path.join(cwd, configPath);

  try {
    fs.statSync(configPath);
    let config = require(configPath);
    if (typeof config === 'function') {
      config = config(process.env);
    }

    Promise.resolve(config).then((config) => {
      const outputPath = config.output.path;

      concurrently([
        `${WEBPACK_PATH} --config ${configPath} --watch --output-path ${path.join(outputPath, config.output.publicPath)}`,
        `${HTTP_SERVER_PATH} ${outputPath} -p ${argv.port || 8003} -c-1 -a ::`,
      ]);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = federate;
