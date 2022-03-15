const { logError, getWebpackConfigPath } = require('./common');
const { resolve } = require('path');
const { spawn } = require('child_process');

function buildScript(argv, cwd) {
  try {
    const processArgs = [];
    let configPath;
    if (typeof argv.webpackConfig !== 'undefined') {
      configPath = getWebpackConfigPath(argv.webpackConfig, cwd);
    } else {
      configPath = resolve(__dirname, './prod.webpack.config.js');
    }
    processArgs.push(`node_modules/.bin/webpack -c ${configPath}`);
    process.env.NODE_ENV = 'production';
    spawn('node', processArgs, {
      stdio: [process.stdout, process.stdout, process.stdout],
      cwd,
      shell: true,
    });
  } catch (error) {
    logError(error);
    process.exit(1);
  }
}

module.exports = buildScript;
