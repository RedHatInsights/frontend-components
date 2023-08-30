#!/usr/bin/env node
const { execSync } = require('child_process');
import serveStatic from '@redhat-cloud-services/frontend-components-config-utilities/serve-federated';
const fs = require('fs');
const path = require('path');
import yargs from 'yargs';
// to force TS to copy the file
import './tsconfig.template.json';

const devScript = require('./dev-script');
const buildScript = require('./build-script');
const { validateFECConfig } = require('./common');
const { fecLogger, LogType } = require('@redhat-cloud-services/frontend-components-config-utilities');

function patchHosts() {
  const command = `
    for host in prod.foo.redhat.com stage.foo.redhat.com qa.foo.redhat.com ci.foo.redhat.com
do
    grep -q $host /etc/hosts 2>/dev/null
    if [ $? -ne 0 ]
    then
        echo "Adding $host to /etc/hosts"
        echo "127.0.0.1 $host" >>/etc/hosts
        echo "::1 $host" >>/etc/hosts
    fi
done
`;
  try {
    execSync(command);
  } catch (error) {
    fecLogger(LogType.error, 'Unable to patch /etc/hosts! Please to run the script as sudo.');
  }
}

const cwd = process.cwd();

function checkDependencies() {
  const requiredDependencies = ['typescript', 'ts-patch', '@redhat-cloud-services/tsc-transform-imports'];
  const missingDependencies: string[] = [];
  const packageJsonFile = path.resolve(cwd, 'package.json');
  // do not destruct the json to not mutate order of attributes in the file
  const pckJson = JSON.parse(fs.readFileSync(packageJsonFile));
  requiredDependencies.forEach((dep) => {
    if (!pckJson.dependencies[dep] && !pckJson.devDependencies[dep]) {
      missingDependencies.push(dep);
    }
  });

  if (!pckJson.scripts.postinstall || !pckJson.scripts.postinstall.includes('ts-patch install')) {
    // prepend patch ts to existing postinstall command
    if (pckJson.scripts.postinstall) {
      pckJson.scripts.postinstall = `ts-patch install && ${pckJson.scripts.postinstall}`;
    } else {
      pckJson.scripts.postinstall = `ts-patch install`;
    }

    fs.writeFileSync(packageJsonFile, JSON.stringify(pckJson, null, 2));
  }

  return missingDependencies;
}
function patchTs(dependencies: string) {
  const usesYarn = fs.existsSync(path.resolve(cwd, 'yarn.lock'));
  if (dependencies.length > 0) {
    let command;
    if (usesYarn) {
      command = `yarn add -D ${dependencies}`;
    } else {
      command = `npm i --save-dev ${dependencies}`;
    }
    fecLogger(LogType.info, 'Installing missing build dependencies: ', command);
    execSync(command, { stdio: 'inherit', cwd });
  }
  fecLogger(LogType.info, 'Patching TS');
  execSync('npx ts-patch install', { stdio: 'inherit', cwd });
  if (!fs.existsSync(path.resolve(cwd, 'tsconfig.json'))) {
    fecLogger(LogType.info, 'Creating base tsconfig.json');
    fs.copyFileSync(path.resolve(__dirname, './tsconfig.template.json'), path.resolve(cwd, 'tsconfig.json'));
  }
}

const argv = yargs
  .usage('Usage: $0 <command> [options]')
  .command('static', 'Serve webpack output without the webpack server', (yargs) => {
    yargs
      .positional('config', {
        type: 'string',
        alias: 'c',
        describe: 'Path to webpack config',
      })
      .positional('port', {
        type: 'number',
        alias: 'p',
        describe: 'Asset server port',
        default: 8003,
      });
  })
  .command('patch-etc-hosts', "You may have to run this as 'sudo'. Setup your etc/hosts allow development hosts in your browser")
  .command('dev', 'Start development server', (yargs) => {
    yargs.positional('webpack-config', {
      type: 'string',
      describe: 'Path to webpack config',
    });
  })
  .command('build', 'Build production bundle', (yargs) => {
    yargs.positional('webpack-config', {
      type: 'string',
      describe: 'Path to webpack config',
    });
  })
  .option('clouddotEnv', {
    describe: "Set platform environment ['stage', 'prod', 'qa', 'ci']",
    type: 'string',
  })
  .option('uiEnv', {
    describe: "Set Chrome environment ['beta', 'stable']",
    type: 'string',
  })
  .example('$0 dev --clouddotEnv=stage --uiEnv=stable', 'Example of usage in non-interactive environments')
  .help().argv;

const scripts: { [name: string]: (...args: any[]) => void } = {
  static: (argv: any, cwd: string) => {
    // set fec config
    validateFECConfig(cwd);
    serveStatic(argv, cwd);
  },
  'patch-etc-hosts': patchHosts,
  dev: (argv: any, cwd: string) => {
    validateFECConfig(cwd);
    devScript(argv, cwd);
  },
  build: buildScript,
  'patch-ts': () => patchTs(checkDependencies().join(' ')),
};

const args = [argv, cwd];

function run() {
  const missingDependencies = checkDependencies();
  if (missingDependencies.length > 0) {
    patchTs(missingDependencies.join(' '));
  }
  if (!(argv as any)._.length || (argv as any)._.length === 0) {
    console.error('Script name must be specified. Run fec --help for more information.');
    process.exit(1);
  }

  scripts[(argv as any)._[0]](...args);
}

run();
