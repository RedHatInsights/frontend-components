#!/usr/bin/env node

const Mustache = require('mustache');
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const inquirer = require('inquirer');
const child_process = require('child_process')
const chalk = require('chalk')

const templates = [...glob.sync(path.resolve(__dirname, '../templates/**/.*')), ...glob.sync(path.resolve(__dirname, '../templates/**/*.*'))];

const cwd = process.cwd();

function parseFrontendYaml(template, values) {
  let internalTemplate = template;
  const bundles = Array.isArray(values.bundle) ? values.bundle : [value.bundle]
  const navItem = `
      - appId: {{appname}}
        title: {{title}}
        href: "/@@bundle/{{appname}}"`
  const route = `
            - pathname: "/@@bundle/{{appname}}"`
  const navItems = bundles.map(bundle => navItem.replace('@@bundle', bundle)).join('')
  const routes = bundles.map(bundle => route.replace('@@bundle', bundle)).join('')

  return internalTemplate.replace('@@navItems', navItems).replace('@@moduleRoutes', routes)
}

function parseFecConfig(template, values) {
  const appUrl = Array.isArray(values.bundle) ? `[${values.bundle.map(bundle => `'/${bundle}/${values.appname}'`)}]` : `/${values.bundle}/${values.appname}`;
  return template.replace('@@appUrl', appUrl)
}

function createCRCApp(values, targetFolder) {
  const target = path.resolve(cwd, targetFolder)
    try {
        fs.mkdirSync(target)
        templates.forEach(file => {
            fileName = file.split('/templates/').pop()
            let template = fs.readFileSync(file, {encoding: 'utf-8'});
            if(fileName.includes('fec.config.js')) {
              template = parseFecConfig(template, values)
            }
            if(fileName.includes('frontend.yaml')) {
              template = parseFrontendYaml(template, values)
            }
            const content = Mustache.render(template, values)
            const fileTarget = path.resolve(target, './', fileName)
            fs.outputFileSync(fileTarget, content, {recursive: true})
        })
        const install = child_process.spawn('npm', ['i --force'], {
          shell: true,
          stdio: [process.stdout, process.stdout, process.stdout],
          cwd: target
        })
        install.on('close', (code) => {
          /** temporary link of FEC-config */
          const link = child_process.spawn('cp', [`-r /home/martin/insights/frontend-components/packages/config/* ${target}/node_modules/@redhat-cloud-services/frontend-components-config/`], {
            shell: true,
            stdio: [process.stdout, process.stdout, process.stdout],
            cwd: target
          })
          link.on('close', (code) => {
            if(code !== 0) {
              console.log(`create-crc-app process exited with code ${code}`);
            } else {
              child_process.spawn('git', ['init'], {
                shell: true,
                stdio: [process.stdout, process.stdout, process.stdout],
                cwd: target
              })
            }
          })
          if (code !== 0) {
            console.log(`create-crc-app process exited with code ${code}`);
          } else {
            console.log(`New console.redhat.ui has been created!\n\ncd into the ./test directory and start coding!\n\n Please run "npm run patch:hosts" to enable development enviroment in your browser.\n\n Run "npm run dev" command to start development environment.`)
          }
        });
    } catch (error) {
        console.log(error)
    }
}

async function setEnv(cwd) {
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
          default: 'starter'
        },
        {
          name: 'bundle',
          type: 'checkbox',
          message: 'To which bundle(s) is this application assiged? (defaults to "staging")',
          choices: ['insights', 'ansible', 'openshift', 'application-services', 'settings', 'edge']
        },
        {
          name: 'title',
          type: 'input',
          message: 'Enter application title. This should be human friendly string. It will be used as navigation link text.',
          default: 'Starter app'
        },
        {
          name: 'disableCSCIntercept',
          type: 'confirm',
          default: false,
          message: 'Disable cloud services config dev server interception. If disable, dev environment will not work unless application was already registered in chrome configuration files. This usually happens after application was deployed to stage environment.'
        }
      ])
      .then(({disableCSCIntercept, ...answers}) => {
        return {...answers, interceptChromeConfig: !disableCSCIntercept, bundle: answers.bundle.length === 0 ? ['staging'] : answers.bundle}
      });
  }



async function run() {
  const args = process.argv.slice(2)
  if(typeof args[0] === 'undefined') {
    console.log(chalk.blue('[fec]') + chalk.red(' ERROR: ') + 'Missing destination folder. example "create-crc-app new-app"');
    process.exit(1)
  }
    try {
        const values = await setEnv()
        createCRCApp(values, args[0]);
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

run()
