/* eslint-disable no-console */
const inquirer = require('inquirer');
const { resolve } = require('path');
const { statSync } = require('fs');
const { spawn } = require('child_process');
const { logError } = require('./common');

async function setEnv() {
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
      {
        name: 'customRoutesInput',
        message: 'Do you want to use custom proxy routes?',
        type: 'confirm',
        default: false,
      },
      {
        name: 'routesPath',
        type: 'input',
        message: 'Enter custom routes file location',
        when: (answers) => answers.customRoutesInput === true,
      },
    ])
    .then((answers) => {
      const { uiEnv, clouddotEnv, routesPath } = answers;
      process.env.BETA = uiEnv === 'beta' ? 'true' : 'false';
      process.env.CLOUDOT_ENV = clouddotEnv ? clouddotEnv : 'stage';
      process.env.ROUTES_PATH = routesPath;
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

async function devScript(argv, cwd) {
  try {
    const processArgs = [];
    if (typeof argv.webpackConfig !== 'undefined') {
      const configPath = getWebpackConfigPath(argv.webpackConfig, cwd);
      processArgs.push(`node_modules/.bin/webpack serve -c ${configPath}`);
    }
    await setEnv();
    spawn('node', processArgs, {
      stdio: [process.stdout, process.stdout, process.stdout],
      cwd,
      shell: true,
    });
  } catch (error) {
    process.exit(1);
  }
}

module.exports = devScript;
