const chalk = require('chalk');
const { resolve } = require('path');
const { statSync } = require('fs');

function logError(message) {
  console.log(chalk.blue('[fec]') + chalk.red(' ERROR: ') + message);
}

function validateFECConfig(cwd) {
  const configPath = resolve(cwd, './fec.config.js');
  try {
    statSync(configPath);
  } catch (error) {
    logError(`Unable to locate "fec.config.js" at ${configPath}`);
    throw 'fec.config.js validation failed, file does not exist';
  }

  const config = require(configPath);
  if (!config.appUrl) {
    logError('Missing config "appUrl" in fec.config.js');
    throw 'fec.config.js validation failed, missing "appUrl" config';
  }
  process.env.FEC_CONFIG_PATH = configPath;
}

function getWebpackConfigPath(path, cwd) {
  let configPath;
  try {
    configPath = resolve(cwd, path);
    statSync(configPath);
    let config = require(configPath);
    if (typeof config === 'function') {
      config = config(process.env);
    }
    return configPath;
  } catch (error) {
    if (configPath) {
      logError(`Unable to open webpack config at: "${configPath}"`);
    } else {
      logError(error);
      throw 'FEC binary failed';
    }
  }
}

module.exports.logError = logError;
module.exports.validateFECConfig = validateFECConfig;
module.exports.getWebpackConfigPath = getWebpackConfigPath;
