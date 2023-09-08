import path from 'path';
import fs from 'fs';
import concurrently from 'concurrently';

function federate(argv: Record<string, any>, cwd: string) {
  let configPath: string = argv.config || './node_modules/@redhat-cloud-services/frontend-components-config/bin/prod.webpack.config.js';
  const WEBPACK_PATH = path.resolve(cwd, './node_modules/.bin/webpack');
  const HTTP_SERVER_PATH = path.resolve(cwd, './node_modules/.bin/http-server');
  if (typeof configPath !== 'string') {
    console.error('Invalid webpack config path!');
    process.exit(1);
  }

  configPath = path.join(cwd, configPath);

  try {
    fs.statSync(configPath);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let config = require(configPath);
    if (typeof config === 'function') {
      config = config(process.env);
    }

    Promise.resolve(config).then((config) => {
      const outputPath = config.output.path;

      concurrently([
        `${WEBPACK_PATH} --config ${configPath} --watch --output-path ${path.join(outputPath, config.output.publicPath)}`,
        `${HTTP_SERVER_PATH} ${outputPath} -p ${argv.port || 8003} -c-1 -a ::`,
      ]);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export default federate;
module.exports = federate;
