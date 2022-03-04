const path = require('path');
const fs = require('fs');
const concurrently = require('concurrently');

async function federate(argv, cwd) {
  let configPath = argv.config;
  const WEBPACK_PATH = path.resolve(cwd, './node_modules/.bin/webpack');
  const HTTP_SERVER_PATH = path.resolve(cwd, './node_modules/.bin/http-server');
  if (typeof configPath !== 'string') {
    console.error('Missing webpack config path');
    process.exit(1);
  }

  configPath = path.join(cwd, configPath);

  try {
    fs.statSync(configPath);
    let config = require(configPath);
    if (typeof config === 'function') {
      config = await Promise.resolve(config(process.env));
    }

    const outputPath = config.output.path;

    concurrently([
      `${WEBPACK_PATH} --config ${configPath} --watch --output-path ${path.join(outputPath, config.output.publicPath)}`,
      `${HTTP_SERVER_PATH} ${outputPath} -p ${argv.port || 8003} -c-1`,
    ]);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = federate;
