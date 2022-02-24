#!/usr/bin/env node

const Mustache = require('mustache');
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const inquirer = require('inquirer');
const child_process = require('child_process');
const chalk = require('chalk');

const templates = [...glob.sync(path.resolve(__dirname, '../templates/**/.*')), ...glob.sync(path.resolve(__dirname, '../templates/**/*.*'))];

const cwd = process.cwd();

function parseFrontendYaml(values) {
  const bundles = Array.isArray(values.bundle) ? values.bundle : [values.bundle];
  const navItem = `
      - appId: {{appname}}
        title: {{title}}
        href: "/@@bundle/{{appname}}"`;
  const route = `
            - pathname: "/@@bundle/{{appname}}"`;
  const navItems = Mustache.render(bundles.map((bundle) => navItem.replace('@@bundle', bundle)).join(''), values);
  const routes = Mustache.render(bundles.map((bundle) => route.replace('@@bundle', bundle)).join(''), values);

  return { yamlNavItems: navItems, ymlRoutes: routes };
}

function parseFecConfig(values) {
  const appUrl = Array.isArray(values.bundle)
    ? `[${values.bundle.map((bundle) => `'/${bundle}/${values.appname}'`)}]`
    : `/${values.bundle}/${values.appname}`;
  return appUrl;
}

function createCRCApp(values, targetFolder) {
  const target = path.resolve(cwd, targetFolder);
  const internalValues = {
    ...values,
    ...parseFrontendYaml(values),
    parsedAppUrl: parseFecConfig(values),
  };
  try {
    fs.mkdirSync(target);
    templates.forEach((file) => {
      const fileName = file.split('/templates/').pop();
      const template = fs.readFileSync(file, { encoding: 'utf-8' });
      const content = Mustache.render(template, internalValues);
      const fileTarget = path.resolve(target, './', fileName);
      fs.outputFileSync(fileTarget, content, { recursive: true });
    });
    const install = child_process.spawn('npm', ['i'], {
      shell: true,
      stdio: [process.stdout, process.stdout, process.stdout],
      cwd: target,
    });
    install.on('close', (code) => {
      if (code !== 0) {
        console.log(`create-crc-app process exited with code ${code}`);
      } else {
        child_process.spawn('git', ['init'], {
          shell: true,
          stdio: [process.stdout, process.stdout, process.stdout],
          cwd: target,
        });
      }
      if (code !== 0) {
        console.log(`create-crc-app process exited with code ${code}`);
      } else {
        console.log(
          `New console.redhat.ui has been created!\n\ncd into the ${targetFolder} directory and start coding!\n\n Please run "npm run patch:hosts" to enable development enviroment in your browser.\n\n Run "npm run dev" command to start development environment.`
        );
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function setEnv() {
  return inquirer
    .prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Enter application name. This value is the package.json "name" entry.',
        default: 'starter',
      },
      {
        name: 'appname',
        type: 'input',
        message: 'Enter unique console.redhat.com identifier',
        default: 'starter',
      },
      {
        name: 'bundle',
        type: 'checkbox',
        message: 'To which bundle(s) is this application assiged? (defaults to "staging")',
        choices: ['insights', 'ansible', 'openshift', 'application-services', 'settings', 'edge'],
      },
      {
        name: 'title',
        type: 'input',
        message: 'Enter application title. This should be human friendly string. It will be used as navigation link text.',
        default: 'Starter app',
      },
      {
        name: 'disableCSCIntercept',
        type: 'confirm',
        default: false,
        message:
          'Disable cloud services config dev server interception. If disable, dev environment will not work unless application was already registered in chrome configuration files. This usually happens after application was deployed to stage environment.',
      },
    ])
    .then(({ disableCSCIntercept, ...answers }) => {
      return { ...answers, interceptChromeConfig: !disableCSCIntercept, bundle: answers.bundle.length === 0 ? ['staging'] : answers.bundle };
    });
}

async function run() {
  const args = process.argv.slice(2);
  if (typeof args[0] === 'undefined') {
    console.log(chalk.blue('[fec]') + chalk.red(' ERROR: ') + 'Missing destination folder. example "create-crc-app new-app"');
    process.exit(1);
  }
  try {
    const values = await setEnv();
    createCRCApp(values, args[0]);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

run();
