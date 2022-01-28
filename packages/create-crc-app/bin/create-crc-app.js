#!/usr/bin/env node

const Mustache = require('mustache');
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const inquirer = require('inquirer');
const child_process = require('child_process')

const templates = [...glob.sync(path.resolve(__dirname, '../templates/**/.*')), ...glob.sync(path.resolve(__dirname, '../templates/**/*.*'))];

const cwd = process.cwd();

const target = path.resolve(cwd, './test')

function createCRCApp(values) {
    console.log(values)
    try {
        fs.mkdirSync(target)
        templates.forEach(file => {
            fileName = file.split('/templates/').pop()
            const template = fs.readFileSync(file, {encoding: 'utf-8'});
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
          message: 'Enter custom application name',
        },
        {
          name: 'appname',
          type: 'input',
          message: 'Enter unique console.redhat.com identifier',
        },
      ])
      .then((answers) => {
        return answers
      });
  }



async function run() {
    try {
        const values = await setEnv()
        createCRCApp(values);
    } catch (error) {
        console.log(error)
    }
}

run()
