/* eslint-disable no-console */
import inquirer from 'inquirer';
const { resolve } = require('path');
import { spawn } from 'child_process';
import treeKill from 'tree-kill';
import { getWebpackConfigPath, validateFECConfig } from './common';
import serveChrome from './serve-chrome';
import { LogType, fecLogger } from '@redhat-cloud-services/frontend-components-config-utilities';
const DEFAULT_CHROME_SERVER_PORT = 9998;

export const flags = (yargs: any) => {
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
      default: true,
      describe: 'Check proxied routes via curl (if available)',
    })
    .option('hot-reload', {
      type: 'boolean',
      default: true,
      describe: 'Enable hot reloading',
    })
    .option('output-configs', {
      type: 'boolean',
      default: false,
      describe: 'Enables output of the full FEC configuration and the resulting Webpack (DevServer) config',
    })
    .option('verbose', {
      type: 'boolean',
      default: false,
      describe: 'Enables verbose mode',
    });
};

async function setEnv(cwd: string) {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'clouddotEnv',
        message: 'Which platform environment you want to use?',
        choices: ['stage', 'prod'],
      },
    ])
    .then((answers) => {
      const { clouddotEnv } = answers;
      process.env.CLOUDOT_ENV = clouddotEnv ? clouddotEnv : 'stage';
      process.env.FEC_ROOT_DIR = cwd;
    });
}

async function devScript(
  argv: {
    webpackConfig?: string;
    clouddotEnv?: string;
    port?: string;
    chromeServerPort?: number | string;
    apps?: string;
    apis?: string;
    proxy?: boolean;
    debug?: boolean;
    proxyCheck?: boolean;
    hotReload?: boolean;
    outputConfigs?: boolean;
    verbose?: boolean;
  },
  cwd: string
) {
  try {
    let localChrome = false;
    let fecConfig: any = {};
    let configPath;
    let chromeHost;
    if (typeof argv.webpackConfig !== 'undefined') {
      configPath = getWebpackConfigPath(argv.webpackConfig, cwd);
      if (typeof argv.chromeServerPort !== 'undefined') {
        process.env.FEC_CHROME_PORT = `${argv.chromeServerPort}`;
      } else {
        fecLogger(LogType.info, `No chrome server port provided, using default port ${DEFAULT_CHROME_SERVER_PORT}`);
        process.env.FEC_CHROME_PORT = `${DEFAULT_CHROME_SERVER_PORT}`;
      }
    } else {
      // validate the FEC config only if a custom webpack config is not provided
      validateFECConfig(cwd);
      fecConfig = require(process.env.FEC_CONFIG_PATH!);
      localChrome = fecConfig.localChrome;
      process.env.FEC_CHROME_PORT = fecConfig.chromePort ?? DEFAULT_CHROME_SERVER_PORT;
      chromeHost = fecConfig.chromeHost;
      configPath = resolve(__dirname, './dev.webpack.config.js');
    }

    const clouddotEnvOptions = ['stage', 'prod'];
    if (argv?.clouddotEnv) {
      if (clouddotEnvOptions.includes(argv.clouddotEnv)) {
        process.env.CLOUDOT_ENV = argv.clouddotEnv;
        process.env.FEC_ROOT_DIR = cwd;
      } else {
        console.error(
          'Incorrect argument value:\n--clouddotEnv must be one of: [',
          clouddotEnvOptions.toString(),
          ']\nRun fec --help for more information.'
        );
        process.exit(1);
      }
    } else {
      // TODO This is neat,
      // but we should just default to stage-stable, which is what we need in dev 99% of the time.
      await setEnv(cwd);
    }

    // TODO refactor: There should be some kind of flags->ENV vars and ENV vars -> options
    if (argv.port) {
      process.env.PORT = argv.port;
    }

    if (argv.proxy) {
      process.env.USE_PROXY = argv.proxy.toString();
    }

    if (argv.apps) {
      process.env.LOCAL_APPS = argv.apps.toString();
    }
    if (argv.apis) {
      process.env.LOCAL_APIS = argv.apis.toString();
    }

    if (argv.debug) {
      process.env.DEBUG = argv.debug.toString();
    }

    if (argv.proxyCheck) {
      process.env.SKIP_PROXY_CHECK = (!argv.proxyCheck).toString();
    }

    if (argv.hotReload) {
      process.env.HOT_RELOAD = argv.hotReload.toString();
    }

    if (argv.outputConfigs) {
      process.env.OUTPUT_CONFIGS = argv.outputConfigs.toString();
    }

    if (argv.verbose) {
      process.env.PROXY_VERBOSE = argv.verbose.toString();
    }

    let webpackProcess: ReturnType<typeof spawn> | undefined = undefined;
    let interceptorProcess: ReturnType<typeof spawn> | undefined = undefined;

    if (!chromeHost) {
      chromeHost = `${process.env.CLOUDOT_ENV === 'prod' ? 'prod' : 'stage'}.foo.redhat.com`;
    }

    process.env.FEC_CHROME_HOST = chromeHost;

    // ignore chrome server if a localChrome is provided
    if (!localChrome && process.env.E2E_CI_RUN !== 'true') {
      // get the directory if the build
      // hsa to require here after all FEC env variables are set
      const devConfig = require('./dev.webpack.config');
      const outputPath = devConfig.output?.path;
      // start chrome frontend server
      try {
        const handleServerError = (error: Error) => {
          fecLogger(LogType.error, error);
          if (webpackProcess?.pid) {
            treeKill(webpackProcess.pid, 'SIGKILL');
          }

          if (interceptorProcess?.pid) {
            treeKill(interceptorProcess.pid, 'SIGKILL');
          }
          process.exit(1);
        };

        await serveChrome(
          outputPath,
          chromeHost,
          handleServerError,
          process.env.CLOUDOT_ENV === 'prod',
          parseInt(process.env.FEC_CHROME_PORT!)
        ).catch((error) => {
          fecLogger(LogType.error, 'Chrome server stopped!');
          handleServerError(error);
        });
      } catch (error) {
        fecLogger(LogType.error, 'Unable to start local Chrome UI server!');
        fecLogger(LogType.error, error);
        process.exit(1);
      }
    }

    webpackProcess = spawn(`npm exec -- webpack serve -c ${configPath}`, [], {
      stdio: [process.stdout, process.stdout, process.stdout],
      cwd,
      shell: true,
    });

    // TODO Move this to be middleware that won't need a separate process.
    if (fecConfig.interceptChromeConfig === true) {
      const interceptorServerPath = resolve(__dirname, './csc-interceptor-server.js');
      const interceptorServerArgs = [interceptorServerPath];
      // Ensure ipv4 DNS is hit first. Currently there are issues with IPV4
      interceptorProcess = spawn('NODE_OPTIONS=--dns-result-order=ipv4first node', interceptorServerArgs, {
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
