/* eslint-disable no-console */
const inquirer = require('inquirer');
const { resolve } = require('path');
const { spawn } = require('child_process');

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

async function run() {
  await setEnv();
  spawn('npm', ['run', 'start'], {
    stdio: [process.stdout, process.stdout, process.stdout],
    cwd: resolve(__dirname, '../'),
  });
}

try {
  run();
} catch (error) {
  console.error(error);
  process.exit(1);
}
