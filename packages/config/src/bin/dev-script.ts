/* eslint-disable no-console */
import inquirer from 'inquirer';
const { resolve } = require('path');
const { spawn } = require('child_process');
import { getWebpackConfigPath, validateFECConfig } from './common';

export const flags = (yargs) => {
  yargs
    .positional('webpack-config', {
      type: 'string',
      describe: 'Path to webpack config',
    })
    .option('port', {
      type: 'number',
      alias: 'p',
      describe: 'Webpack dev server port',
      default: 1337,
    })
    .option('proxy', {
      type: 'boolean',
      default: false,
      describe: 'Enable proxying',
    })
    .option('apps', {
      type: 'string',
      describe:
        'A coma seperated string of frontend applications with ports and optional protocol to create routes for (APP_NAME:APP_PORT[~APP_PROTOCOL])',
    })
    .option('apis', {
      type: 'string',
      describe:
        'A coma seperated string of application APIs with ports and optional protocol to create routes for (APP_NAME:APP_PORT[~APP_PROTOCOL])',
    })
    .option('proxy-check', {
      type: 'boolean',
      default: false,
      describe: 'Disable checking proxied routes via curl (if available)',
    });
};

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
    port?: string;
    apps?: string;
    apis?: string;
    proxy?: boolean;
    debug?: boolean;
    proxyCheck?: boolean;
  },
  cwd: string
) {
  try {
    let fecConfig: any = {};
    let configPath;
    if (typeof argv.webpackConfig !== 'undefined') {
      configPath = getWebpackConfigPath(argv.webpackConfig, cwd);
    } else {
      // validate the FEC config only if a custom webpack config is not provided
      validateFECConfig(cwd);
      fecConfig = require(process.env.FEC_CONFIG_PATH!);
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

    if (argv.port) {
      process.env.PORT = argv.port;
    }

    if (argv.proxy) {
      process.env.USE_PROXY = 'true';
    }

    if (argv.apps) {
      process.env.LOCAL_APPS = argv.apps;
    }

    if (argv.apis) {
      process.env.LOCAL_APIS = argv.apis;
    }

    if (argv.debug) {
      process.env.DEBUG = 'true';
    }

    if (argv.proxyCheck === false) {
      process.env.SKIP_PROXY_CHECK = 'true';
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

export default devScript;
module.exports = devScript;
module.exports.flags = flags;
