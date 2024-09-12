import { LogType, fecLogger } from '@redhat-cloud-services/frontend-components-config-utilities';

import { getRSpackConfigPath, validateFECConfig } from './common';
const { resolve } = require('path');
import { spawn } from 'child_process';

export function buildScript(argv: { [name: string]: string }, cwd: string) {
  let configPath;
  if (typeof argv.rspackConfig !== 'undefined') {
    configPath = getRSpackConfigPath(argv.rspackConfig, cwd);
  } else {
    // validate the FEC config only if a custom rspack config is not provided
    validateFECConfig(cwd);
    configPath = resolve(__dirname, './prod.rspack.config.js');
  }
  process.env.NODE_ENV = 'production';
  const subprocess = spawn(`npm exec -- rspack -c ${configPath}`, [], {
    stdio: [process.stdout, process.stdout, process.stdout],
    cwd,
    shell: true,
  });
  subprocess.on('error', function (err) {
    fecLogger(LogType.error, err);
    process.exit(1);
  });
  subprocess.on('exit', (code: number | null, signal: string) => {
    if (code) {
      fecLogger(LogType.error, 'Exited with code', code);
      process.exit(code);
    } else if (signal) {
      fecLogger(LogType.error, 'Exited with signal', signal);
      process.exit(1);
    } else {
      fecLogger(LogType.info, 'Exited Okay');
    }
  });
}

export default buildScript;
module.exports = buildScript;
