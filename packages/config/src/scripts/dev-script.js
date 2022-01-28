/* eslint-disable no-console */
const inquirer = require('inquirer');
const { resolve } = require('path');
const { statSync } = require('fs');
const { spawn } = require('child_process');
const { logError } = require('./common');

async function setEnv(cwd) {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'clouddotEnv',
        message: 'Which platform environment you want to use?',
        choices: ['stage', 'prod', 'qa', 'ci'],
      },
      {
        type: 'list',
        name: 'uiEnv',
        message: 'Which Chrome environment you want to use?',
        choices: ['beta', 'stable'],
      },
    ])
    .then((answers) => {
      const { uiEnv, clouddotEnv } = answers;
      process.env.BETA = uiEnv === 'beta' ? 'true' : 'false';
      process.env.CLOUDOT_ENV = clouddotEnv ? clouddotEnv : 'stage';
      process.env.FEC_ROOT_DIR = cwd;
    });
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

async function devScript(argv, cwd) {
  try {
    validateFECConfig(cwd);

    const fecConfig = require(process.env.FEC_CONFIG_PATH);
    const processArgs = [];
    let configPath;
    if (typeof argv.webpackConfig !== 'undefined') {
      configPath = getWebpackConfigPath(argv.webpackConfig, cwd);
    } else {
      configPath = resolve(__dirname, './dev.webpack.config.js');
    }
    processArgs.push(`node_modules/.bin/webpack serve -c ${configPath}`);
    await setEnv(cwd);
    spawn('node', processArgs, {
      stdio: [process.stdout, process.stdout, process.stdout],
      cwd,
      shell: true,
    });
    if (fecConfig.interceptChromeConfig === true) {
      const interceptorServerPath = resolve(__dirname, './csc-interceptor-server.js');
      const interceptorServerArgs = [interceptorServerPath];
      spawn('node', interceptorServerArgs, {
        stdio: [process.stdout, process.stdout, process.stdout],
        cwd,
        shell: true,
      });
    }
  } catch (error) {
    process.exit(1);
  }
}

module.exports = devScript;
