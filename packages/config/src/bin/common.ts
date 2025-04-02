import { LogType, fecLogger } from '@redhat-cloud-services/frontend-components-config-utilities';

const { resolve } = require('path');
const { statSync } = require('fs');

export function validateFECConfig(cwd: string) {
  const configPath = resolve(cwd, './fec.config.js');
  try {
    statSync(configPath);
  } catch (error) {
    fecLogger(LogType.error, `Unable to locate "fec.config.js" at ${configPath}`);
    throw 'fec.config.js validation failed, file does not exist';
  }

  const config = require(configPath);
  if (!config.appUrl) {
    fecLogger(LogType.error, 'Missing config "appUrl" in fec.config.js');
    throw 'fec.config.js validation failed, missing "appUrl" config';
  }

  if (config.publicPath && config.publicPath !== 'auto') {
    fecLogger(LogType.error, 'Invalid config "publicPath" in fec.config.js, must be empty or set to "auto"');
    throw 'fec.config.js validation failed, "publicPath" must be empty or set to "auto"';
  }
  process.env.FEC_CONFIG_PATH = configPath;
}

export function getWebpackConfigPath(path: string, cwd: string) {
  let configPath;
  try {
    configPath = resolve(cwd, path);
    statSync(configPath);
    let config = require(configPath);
    if (typeof config === 'function') {
      config = config(process.env);
    }
    return configPath;
  } catch (error: any) {
    if (configPath) {
      fecLogger(LogType.error, `Unable to open webpack config at: "${configPath}"`);
    } else {
      fecLogger(LogType.error, error);
      throw 'FEC binary failed';
    }
  }
}

module.exports.validateFECConfig = validateFECConfig;
module.exports.getWebpackConfigPath = getWebpackConfigPath;
