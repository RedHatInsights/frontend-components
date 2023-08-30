import { LogType, fecLogger } from '@redhat-cloud-services/frontend-components-config-utilities';

import { getWebpackConfigPath, validateFECConfig } from './common';
const { resolve } = require('path');
import { spawn } from 'child_process';

export function buildScript(argv: { [name: string]: string }, cwd: string) {
  validateFECConfig(cwd);
  let configPath;
  if (typeof argv.webpackConfig !== 'undefined') {
    configPath = getWebpackConfigPath(argv.webpackConfig, cwd);
  } else {
    configPath = resolve(__dirname, './prod.webpack.config.js');
  }
  process.env.NODE_ENV = 'production';
  const subprocess = spawn(`npm exec -- webpack -c ${configPath}`, [], {
    stdio: [process.stdout, process.stdout, process.stdout],
    cwd,
    shell: true,
  });
  subprocess.on('error', function (err) {
    fecLogger(LogType.error, err);
    process.exit(1);
  });
  subprocess.on('exit', (code: string | null, signal: string) => {
    if (code) {
      fecLogger(LogType.error, 'Exited with code', code);
    } else if (signal) {
      fecLogger(LogType.error, 'Exited with signal', signal);
    } else {
      fecLogger(LogType.info, 'Exited Okay');
    }
  });
}

export default buildScript;
module.exports = buildScript;
