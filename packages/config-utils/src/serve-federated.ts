import path from 'path';
import fs from 'fs';
import concurrently from 'concurrently';
import { hasFEOFeaturesEnabled, readFrontendCRD } from './feo/crd-check';
import { FrontendCRD } from './feo/feo-types';
import fecLogger, { LogType } from './fec-logger';

function federate(argv: Record<string, any>, cwd: string) {
  let configPath: string = argv.config || './node_modules/@redhat-cloud-services/frontend-components-config/bin/prod.webpack.config.js';
  if (typeof configPath !== 'string') {
    console.error('Invalid webpack config path!');
    process.exit(1);
  }

  configPath = path.join(cwd, configPath);
  const fecConfig = require(process.env.FEC_CONFIG_PATH!);
  const { insights } = require(`${cwd}/package.json`);
  const frontendCRDPath = fecConfig.frontendCRDPath ?? path.resolve(process.cwd(), 'deploy/frontend.yaml');

  const frontendCrdRef: { current?: FrontendCRD } = { current: undefined };
  let FEOFeaturesEnabled = false;
  try {
    frontendCrdRef.current = readFrontendCRD(frontendCRDPath);
    FEOFeaturesEnabled = hasFEOFeaturesEnabled(frontendCrdRef.current);
  } catch (e) {
    fecLogger(
      LogType.warn,
      `FEO features are not enabled. Unable to find frontend CRD file at ${frontendCRDPath}. If you want FEO features for local development, make sure to have a "deploy/frontend.yaml" file in your project or specify its location via "frontendCRDPath" attribute.`
    );
  }
  try {
    fs.statSync(configPath);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let config = require(configPath);
    if (typeof config === 'function') {
      config = config(process.env);
    }
    // take the CDN path from the config or generate it based on the deployment
    let cdnPath: string;
    // Could be written on a single line, but this is nice and readable
    if (FEOFeaturesEnabled && fecConfig.publicPath === 'auto' && frontendCrdRef.current) {
      // All service should eventually use this path
      cdnPath = `${frontendCrdRef.current?.objects[0]?.spec.frontend.paths[0]}/`.replace(/\/\//, '/');
    } else if (fecConfig.publicPath === 'auto') {
      cdnPath = `/${fecConfig.deployment || 'apps'}/${insights.appname}/`;
    } else {
      cdnPath = config.output.publicPath;
    }

    Promise.resolve(config).then((config) => {
      const outputPath = config.output.path;

      concurrently([
        `npm exec -- webpack --config ${configPath} --watch --output-path ${path.join(outputPath, cdnPath)}`,
        `npm exec -- http-server ${outputPath} -p ${argv.port || 8003} -c-1 -a :: --cors=*`,
      ]);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export default federate;
