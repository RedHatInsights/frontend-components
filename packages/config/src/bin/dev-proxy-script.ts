import { exec, execSync } from 'child_process';
import concurrently, { Command } from 'concurrently';
import fs from 'fs';
import inquirer from 'inquirer';
import os from 'os';
import path from 'path';
import treeKill from 'tree-kill';
import { fecLogger as fecLoggerDefault, LogType } from '@redhat-cloud-services/frontend-components-config-utilities';
import { FrontendCRD } from '@redhat-cloud-services/frontend-components-config-utilities/feo/feo-types';
import { hasFEOFeaturesEnabled, readFrontendCRD } from '@redhat-cloud-services/frontend-components-config-utilities/feo/crd-check';
import { validateFECConfig } from './common';
import serveChrome, { CONTAINER_NAME as CHROME_CONTAINTER_NAME } from './serve-chrome';

const PROXY_URL = 'http://squid.corp.redhat.com:3128';
const DEFAULT_LOCAL_ROUTE = 'host.docker.internal';
const DEFAULT_CHROME_SERVER_PORT = 9998;
const LATEST_IMAGE_TAG = 'latest';

const DEV_PROXY_CONTAINER_PORT = 1337;
const DEV_PROXY_CONTAINER_NAME = 'frontend-development-proxy';
const DEV_PROXY_IMAGE_REPO = `quay.io/redhat-user-workloads/hcc-platex-services-tenant/${DEV_PROXY_CONTAINER_NAME}`;

type ContainerRuntime = 'docker' | 'podman';
let execBin: ContainerRuntime | undefined = undefined;
let debug: boolean = false;

interface RouteConfig {
  url: string;
  is_chrome?: boolean;
}

function fecLogger(logType: LogType, ...data: any[]) {
  if (logType === LogType.debug) {
    if (debug) {
      fecLoggerDefault(logType, ...data);
    }
  } else {
    fecLoggerDefault(logType, ...data);
  }
}

function checkContainerRuntime(): ContainerRuntime {
  try {
    if (execSync('which podman').toString().trim().length > 0) {
      return 'podman';
    }
  } catch (_) {
    // Ignore!
  }

  try {
    if (execSync('which docker').toString().trim().length > 0) {
      return 'docker';
    }
  } catch (_) {
    // Ignore!
  }

  throw new Error('No container runtime found');
}

function removeContainer(containerName: string) {
  try {
    fecLogger(LogType.info, `Removing existing container: ${containerName}`);
    execSync(`${execBin} rm ${containerName}`, debug ? { stdio: 'inherit' } : { stdio: [] });
  } catch (error) {
    fecLogger(LogType.error, `Failed to remove the container: ${containerName}`);
  }
}

function stopContainer(containerName: string) {
  try {
    let isRunning: boolean = true;
    try {
      execSync(`${execBin} inspect -f '{{.State.Running}}' ${containerName}\n`).toString().trim().toLowerCase() === 'true';
    } catch (error) {
      isRunning = false;
    }

    if (isRunning) {
      fecLogger(LogType.info, `Stopping container: ${containerName}`);
      execSync(`${execBin} stop ${containerName}`, debug ? { stdio: 'inherit' } : { stdio: [] });
    }
  } catch (error) {
    fecLogger(LogType.error, `Failed to stop the container: ${containerName}`);
  }
}

function pullImage(containerName: string, repo: string, tag: string) {
  fecLogger(LogType.info, `Pulling the container: ${containerName}`);
  execSync(`${execBin} pull ${repo}:${tag}`, debug ? { stdio: 'inherit' } : { stdio: [] });
}

function getCdnPath(fecConfig: any, webpackConfig: any, cwd: string): string {
  let cdnPath: string;
  const { insights } = require(`${cwd}/package.json`);
  const frontendCRDPath = fecConfig.frontendCRDPath ?? `${cwd}/deploy/frontend.yaml`;
  const frontendCRDRef: { current?: FrontendCRD } = { current: undefined };
  let FEOFeaturesEnabled = false;

  try {
    frontendCRDRef.current = readFrontendCRD(frontendCRDPath);
    FEOFeaturesEnabled = hasFEOFeaturesEnabled(frontendCRDRef.current);
  } catch (e) {
    fecLogger(
      LogType.warn,
      `FEO features are not enabled. Unable to find frontend CRD file at ${frontendCRDPath}. If you want FEO features for local development, make sure to have a "deploy/frontend.yaml" file in your project or specify its location via "frontendCRDPath" attribute.`,
    );
  }

  if (FEOFeaturesEnabled && fecConfig.publicPath === 'auto' && frontendCRDRef.current) {
    cdnPath = `${frontendCRDRef.current?.objects[0]?.spec.frontend.paths[0]}/`.replace(/\/\//, '/');
  } else if (fecConfig.publicPath === 'auto') {
    cdnPath = `/${fecConfig.deployment || 'apps'}/${insights.appname}/`;
  } else {
    cdnPath = webpackConfig.output.publicPath;
  }

  return cdnPath ?? '';
}

function createRoutesConfig(fecConfig: any, cdnPath: string, port: string, historyFallback: boolean, filename: string = 'routes.json'): string {
  let routes: Map<string, RouteConfig> = new Map();

  if (historyFallback) {
    let chromeHost = process.env.FEC_CHROME_HOST;
    if (chromeHost) {
      chromeHost = chromeHost.replace(/localhost/, DEFAULT_LOCAL_ROUTE).replace(/127\.0\.0\.1/, DEFAULT_LOCAL_ROUTE);
    } else {
      chromeHost = DEFAULT_LOCAL_ROUTE;
    }
    routes.set('/apps/chrome/*', {
      url: `${chromeHost}:${process.env.FEC_CHROME_PORT}`,
      is_chrome: true,
    });
  }

  routes.set(`${cdnPath}*`, { url: `${DEFAULT_LOCAL_ROUTE}:${port}` });

  let fecRoutes = fecConfig?.routes || undefined;
  if (fecConfig?.routesPath) {
    fecRoutes = require(fecConfig.routesPath);
  }
  if (fecRoutes) {
    fecRoutes = fecRoutes?.routes || fecRoutes;
  }

  Object.entries<any>(fecRoutes || {}).forEach(([handle, config]) => {
    if (config?.host) {
      const host = config.host.replace(/localhost/, DEFAULT_LOCAL_ROUTE).replace(/127\.0\.0\.1/, DEFAULT_LOCAL_ROUTE);
      routes.set(`${handle}*`, { url: host });
    }
  });

  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, filename);
  const jsonContent = JSON.stringify(Object.fromEntries(routes));
  fs.writeFileSync(tempFilePath, jsonContent, { flag: 'w' });

  return tempFilePath;
}

async function setEnv(cwd: string) {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'clouddotEnv',
        message: 'Which platform environment you want to use?',
        choices: ['stage', 'prod', 'dev', 'ephemeral'],
      },
    ])
    .then(async (answers) => {
      const { clouddotEnv } = answers;

      if (clouddotEnv === 'ephemeral') {
        const answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'clouddotEnv',
            message: 'Please provide the gateway route of your ephemeral environment:',
          },
        ]);
        process.env.EPHEMERAL_TARGET = answer.clouddotEnv;
      }

      process.env.CLOUDOT_ENV = clouddotEnv ? clouddotEnv : 'stage';
      process.env.FEC_ROOT_DIR = cwd;
    });
}

async function configureEnvVars(fecConfig: any, argv: any, cwd: string) {
  const clouddotEnvOptions = ['stage', 'prod'];
  if (argv?.clouddotEnv) {
    if (!clouddotEnvOptions.includes(argv?.clouddotEnv)) {
      throw Error(
        `Incorrect argument value:\n--clouddotEnv must be one of: [${clouddotEnvOptions.toString()}]\nRun fec --help for more information.`,
      );
    }
    process.env.HCC_ENV = argv?.clouddotEnv;
  } else {
    await setEnv(cwd);
    process.env.HCC_ENV = process.env.CLOUDOT_ENV;
  }
  const hccEnvSuffix = process.env.HCC_ENV === 'prod' ? '' : `${process.env.HCC_ENV}.`;
  process.env.HCC_ENV_URL = process.env.HCC_ENV === 'ephemeral' ? process.env.EPHEMERAL_TARGET : `https://console.${hccEnvSuffix}redhat.com`;

  process.env.FEC_CHROME_HOST = fecConfig?.chromeHost ?? '127.0.0.1';
  process.env.FEC_CHROME_PORT = fecConfig?.chromePort ?? DEFAULT_CHROME_SERVER_PORT;
}

async function devProxyScript(
  argv: {
    chromeServerPort?: number | string;
    clouddotEnv?: string;
    config?: any;
    port?: string;
  },
  cwd: string,
) {
  let historyFallback = true;
  let fecConfig: any = {};
  let webpackConfig;
  const webpackConfigPath: string =
    argv.config || `${cwd}/node_modules/@redhat-cloud-services/frontend-components-config/bin/dev-proxy.webpack.config.js`;
  process.env.FEC_DEV_PROXY = 'true';

  // Get Configs
  try {
    validateFECConfig(cwd);
    fecConfig = require(process.env.FEC_CONFIG_PATH!);
    fecConfig = structuredClone(fecConfig);
    debug = fecConfig?.debug ?? false;
  } catch (error) {
    fecLogger(LogType.error, 'Failed to get the FEC config, error:', error);
    process.exit(1);
  }
  try {
    fs.statSync(webpackConfigPath);
    webpackConfig = require(webpackConfigPath);
    if (typeof webpackConfig === 'function') {
      webpackConfig = webpackConfig(process.env);
    }
  } catch (error) {
    fecLogger(LogType.error, 'Failed to get the Webpack config, error:', error);
    process.exit(1);
  }

  // Process environment variables, history fallback
  try {
    historyFallback = fecConfig?.historyFallback ?? true;
    await configureEnvVars(fecConfig, argv, cwd);
  } catch (error) {
    fecLogger(LogType.error, 'Failed to setup environment from args and config, error:', error);
    process.exit(1);
  }

  // Setup Routes
  let cdnPath: string;
  let routesConfigPath: string;
  const staticPort = '8003';
  try {
    cdnPath = getCdnPath(fecConfig, webpackConfig, cwd);
    routesConfigPath = createRoutesConfig(fecConfig, cdnPath, staticPort, historyFallback);
  } catch (error) {
    fecLogger(LogType.error, 'Failed to generate the proxy routes config, error:', error);
    process.exit(1);
  }

  // Setup Container
  execBin = checkContainerRuntime();
  stopContainer(DEV_PROXY_CONTAINER_NAME);
  stopContainer(CHROME_CONTAINTER_NAME);
  pullImage(DEV_PROXY_CONTAINER_NAME, DEV_PROXY_IMAGE_REPO, LATEST_IMAGE_TAG);
  removeContainer(DEV_PROXY_CONTAINER_NAME);

  // Exec
  let commands: Command[] = [];
  let waitOnProcess: ReturnType<typeof exec> | undefined = undefined;

  const cleanup = () => {
    commands.forEach((cmd) => {
      if (cmd.pid) {
        treeKill(cmd.pid, 'SIGKILL');
      }
    });
    if (waitOnProcess?.pid) {
      treeKill(waitOnProcess.pid, 'SIGKILL');
    }
    stopContainer(DEV_PROXY_CONTAINER_NAME);
    stopContainer(CHROME_CONTAINTER_NAME);
    console.log('\n');
  };

  try {
    await Promise.resolve(webpackConfig).then(async (config) => {
      const outputPath = config.output.path;
      const proxyEnvVar = process.env.HCC_ENV === 'stage' ? '-e HTTPS_PROXY=$RH_PROXY_URL' : '';
      const proxyVerbose = fecConfig?.proxyVerbose ? `&& ${execBin} logs -f ${DEV_PROXY_CONTAINER_NAME}` : '';
      const appUrl = fecConfig?.appUrl;

      try {
        if (historyFallback) {
          const handleServerError = (error: Error) => {
            fecLogger(LogType.error, error);
            cleanup();
            process.exit(1);
          };

          await serveChrome(
            outputPath,
            process.env.FEC_CHROME_HOST ?? '127.0.0.1',
            handleServerError,
            process.env.CLOUDOT_ENV === 'prod',
            parseInt(process.env.FEC_CHROME_PORT!),
          ).catch((error) => {
            fecLogger(LogType.error, 'Chrome server stopped!');
            handleServerError(error);
          });
        }
      } catch (error) {
        fecLogger(LogType.error, 'Unable to start local Chrome UI server!');
        fecLogger(LogType.error, error);
        process.exit(1);
      }

      const { result, commands: cmds } = concurrently(
        [
          {
            command: `npm exec -- webpack --config ${webpackConfigPath} --watch --output-path ${path.join(outputPath, cdnPath)}`,
            name: 'BUILD',
            prefixColor: 'bgBlue',
          },
          {
            command: `npm exec -- http-server ${outputPath} -p ${staticPort} -c-1 -a :: --cors=*`,
            name: 'SERVE',
            prefixColor: 'bgGreen',
          },
          {
            command: `${execBin} run -d -e HCC_ENV=${process.env.HCC_ENV} -e HCC_ENV_URL=${process.env.HCC_ENV_URL} ${proxyEnvVar} -p ${argv.port || 1337}:${DEV_PROXY_CONTAINER_PORT} -v "${routesConfigPath}:/config/routes.json:ro,Z" --name ${DEV_PROXY_CONTAINER_NAME} ${DEV_PROXY_IMAGE_REPO}:${LATEST_IMAGE_TAG} ${proxyVerbose}`,
            name: 'PROXY',
            env: { RH_PROXY_URL: PROXY_URL },
            prefixColor: 'bgMagenta',
          },
        ],
        {
          prefix: 'name',
          killOthers: ['failure'],
          pauseInputStreamOnFinish: true,
        },
      );
      commands = cmds;

      waitOnProcess = exec(
        `npm exec -- wait-on --timeout 60000 --delay 10000 https://${process.env.HCC_ENV}.foo.redhat.com:${argv.port || 1337}${appUrl}`,
        (error) => {
          if (error) {
            return;
          }
          console.log('\u001b[43m[INFO ]\x1b[0m App should run on:');
          console.log(`\u001b[43m[INFO ]\x1b[0m \t- \u001b[34mhttps://${process.env.HCC_ENV}.foo.redhat.com:${argv.port || 1337}${appUrl}\x1b[0m`);
          console.log('\u001b[43m[INFO ]\x1b[0m Static assets are available at:');
          console.log(`\u001b[43m[INFO ]\x1b[0m \t- \u001b[34mhttps://${process.env.HCC_ENV}.foo.redhat.com:${argv.port || 1337}${cdnPath}\x1b[0m`);
        },
      );

      result.then(
        () => {
          cleanup();
          process.exit(0);
        },
        () => {
          cleanup();
          process.exit(1);
        },
      );
    });
  } catch (error) {
    fecLogger(LogType.error, error);
    process.exit(1);
  }
}

module.exports = devProxyScript;
