#!/usr/bin/env node
import serveStatic from '@redhat-cloud-services/frontend-components-config-utilities/serve-federated';
const { fecLogger, LogType } = require('@redhat-cloud-services/frontend-components-config-utilities');
import yargs from 'yargs';
// to force TS to copy the file
import './tsconfig.template.json';
import { validateFECConfig } from './common';

const { lookup } = require('dns');
const { promisify } = require('util');
const { execSync } = require('child_process');

const fs = require('fs');
const path = require('path');

const devScript = require('./dev-script');
const devProxyScript = require('./dev-proxy-script');
const buildScript = require('./build-script');

const promisifiedLookup = promisify(lookup);

const hosts = ['prod.foo.redhat.com', 'stage.foo.redhat.com', 'qa.foo.redhat.com', 'ci.foo.redhat.com', 'ephemeral.foo.redhat.com'];

function patchHosts() {
  const command = `
    for host in ${hosts.join(' ')} 
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

async function checkHostname(hostname: string) {
  try {
    await promisifiedLookup(hostname);
  } catch {
    return hostname;
  }
}

async function checkHosts(): Promise<string[]> {
  const missingHosts = await Promise.allSettled<string | undefined>(hosts.map(checkHostname));
  return missingHosts.filter((v) => v.status === 'fulfilled').filter(v => v.value !== undefined).map(v => v.value!);
}

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
      .option('port', {
        type: 'number',
        alias: 'p',
        describe: 'Asset server port',
        default: 8003,
      });
  })
  .command('patch-etc-hosts', "You may have to run this as 'sudo'. Setup your etc/hosts allow development hosts in your browser")
  .command('dev', 'Start development server', (yargs) => {
    yargs
      .positional('webpack-config', {
        type: 'string',
        describe: 'Path to webpack config',
      })
      .option('port', {
        type: 'number',
        alias: 'p',
        describe: 'Asset server port',
        default: 1337,
      });
  })
  .command('dev-proxy', 'Start development proxy', (yargs) => {
    yargs.option('port', {
      type: 'number',
      alias: 'p',
      describe: 'Proxy server port',
      default: 1337,
    });
  })
  .command('build', 'Build production bundle', (yargs) => {
    yargs.positional('webpack-config', {
      type: 'string',
      describe: 'Path to webpack config',
    });
  })
  .option('clouddotEnv', {
    describe: "Set platform environment ['stage', 'prod', 'ephemeral']",
    type: 'string',
  })
  .example('$0 dev --clouddotEnv=stage', 'Example of usage in non-interactive environments')
  .help().argv;

const scripts: { [name: string]: (...args: any[]) => void } = {
  static: (argv: any, cwd: string) => {
    validateFECConfig(cwd);
    serveStatic(argv, cwd);
  },
  'patch-etc-hosts': patchHosts,
  dev: (argv: any, cwd: string) => {
    devScript(argv, cwd);
  },
  'dev-proxy': (argv: any, cwd: string) => {
    devProxyScript(argv, cwd);
  },
  build: buildScript,
  'patch-ts': () => patchTs(checkDependencies().join(' ')),
};

const args = [argv, cwd];

async function run() {
  const missingDependencies = checkDependencies();
  if (missingDependencies.length > 0) {
    patchTs(missingDependencies.join(' '));
  }
  const missingHosts = await checkHosts();
  if (missingHosts.length > 0) {
    fecLogger(LogType.warn, `Found missing hosts`);
    fecLogger(LogType.warn, `\`fec dev\` will likely not work correctly. Please consider running \`fec patch-etc-hosts\` to fix the problem.`);
    fecLogger(LogType.warn, `Missing hosts`);
    fecLogger(LogType.warn, missingHosts.join(' '));
  }
  if (!(argv as any)._.length || (argv as any)._.length === 0) {
    console.error('Script name must be specified. Run fec --help for more information.');
    process.exit(1);
  }

  scripts[(argv as any)._[0]](...args);
}

void run();
