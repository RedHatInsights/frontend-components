import inquirer from 'inquirer';
import fecLogger, { LogType } from '@redhat-cloud-services/frontend-components-config-utilities/fec-logger';
import { hasFEOFeaturesEnabled, readFrontendCRD, FrontendCRD } from '@redhat-cloud-services/frontend-components-config-utilities/feo';

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

export async function setEnv(cwd: string) {
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

export function getCdnPath(fecConfig: any, webpackConfig: any, cwd: string): string {
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

module.exports.validateFECConfig = validateFECConfig;
module.exports.getWebpackConfigPath = getWebpackConfigPath;
module.exports.setEnv = setEnv;
module.exports.getCdnPath = getCdnPath;
