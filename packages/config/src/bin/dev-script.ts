/* eslint-disable no-console */
import inquirer from 'inquirer';
const { resolve } = require('path');
const { spawn } = require('child_process');
import { getWebpackConfigPath, validateFECConfig } from './common';

async function setEnv(cwd: string) {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'clouddotEnv',
        message: 'Which platform environment you want to use?',
        choices: ['stage', 'prod', { value: 'qa', name: 'qa (deprecated)' }, { value: 'ci', name: 'ci (deprecated)' }],
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

async function devScript(
  argv: {
    webpackConfig?: string;
    clouddotEnv?: string;
    uiEnv?: string;
  },
  cwd: string
) {
  try {
    validateFECConfig(cwd);

    const fecConfig = require(process.env.FEC_CONFIG_PATH!);
    let configPath;
    if (typeof argv.webpackConfig !== 'undefined') {
      configPath = getWebpackConfigPath(argv.webpackConfig, cwd);
    } else {
      configPath = resolve(__dirname, './dev.webpack.config.js');
    }

    const clouddotEnvOptions = ['stage', 'prod', 'qa', 'ci'];
    const uiEnvOptions = ['beta', 'stable'];
    if (argv?.clouddotEnv && argv?.uiEnv) {
      if (clouddotEnvOptions.includes(argv.clouddotEnv) && uiEnvOptions.includes(argv.uiEnv)) {
        process.env.BETA = argv.uiEnv === 'beta' ? 'true' : 'false';
        process.env.CLOUDOT_ENV = argv.clouddotEnv;
        process.env.FEC_ROOT_DIR = cwd;
      } else {
        console.error(
          'Incorrect argument value:\n--clouddotEnv must be one of: [',
          clouddotEnvOptions.toString(),
          ']\n--uiEnv must be one of: [',
          uiEnvOptions.toString(),
          ']\nRun fec --help for more information.'
        );
        process.exit(1);
      }
    } else {
      await setEnv(cwd);
    }

    spawn(`npm exec -- webpack serve -c ${configPath}`, [], {
      stdio: [process.stdout, process.stdout, process.stdout],
      cwd,
      shell: true,
    });
    if (fecConfig.interceptChromeConfig === true) {
      const interceptorServerPath = resolve(__dirname, './csc-interceptor-server.js');
      const interceptorServerArgs = [interceptorServerPath];
      // Ensure ipv4 DNS is hit first. Currently there are issues with IPV4
      spawn('NODE_OPTIONS=--dns-result-order=ipv4first node', interceptorServerArgs, {
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
