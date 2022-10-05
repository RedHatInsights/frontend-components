const { logError, getWebpackConfigPath, validateFECConfig } = require('./common');
const { resolve } = require('path');
const { spawn } = require('child_process');

function buildScript(argv, cwd) {
  validateFECConfig(cwd);
  const processArgs = [];
  let configPath;
  if (typeof argv.webpackConfig !== 'undefined') {
    configPath = getWebpackConfigPath(argv.webpackConfig, cwd);
  } else {
    configPath = resolve(__dirname, './prod.webpack.config.js');
  }
  processArgs.push(`node_modules/.bin/webpack -c ${configPath}`);
  process.env.NODE_ENV = 'production';
  const subprocess = spawn('node', processArgs, {
    stdio: [process.stdout, process.stdout, process.stdout],
    cwd,
    shell: true,
  });
  subprocess.on('error', function (err) {
    logError(err);
    process.exit(1);
  });
  subprocess.on('exit', (code, signal) => {
    if (code) {
      logError('Exited with code', code);
    } else if (signal) {
      logError('Exited with signal', signal);
    } else {
      console.log('Exited Okay');
    }
  });
}

module.exports = buildScript;
