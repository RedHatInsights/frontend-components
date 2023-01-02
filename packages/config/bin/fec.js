#!/usr/bin/env node
const { execSync } = require('child_process');
const static = require('@redhat-cloud-services/frontend-components-config-utilities/serve-federated');
const yargs = require('yargs');

const devScript = require('../src/scripts/dev-script');
const buildScript = require('../src/scripts/build-script');
const { logError, validateFECConfig } = require('../src/scripts/common');

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
`
    try {
        execSync(command)    
    } catch (error) {
        logError('Unable to patch /etc/hosts! Please to run the script as sudo.')
    }
}

const cwd = process.cwd();

const argv = yargs
.usage('Usage: $0 <command> [options]')
.command('static', 'Serve webpack output without the webpack server', (yargs) => {
    yargs.positional('config', {
        type: 'string',
        alias: 'c',
        describe: 'Path to webpack config'
    }).positional('port', {
        type: 'number',
        alias: 'p',
        describe: 'Asset server port',
        default: 8003
    });
})
.command('patch-etc-hosts', 'You may have to run this as \'sudo\'. Setup your etc/hosts allow development hosts in your browser')
.command('dev', 'Start development server', (yargs) => {
    yargs.positional('webpack-config', {
        type: 'string',
        describe: 'Path to webpack config',
    })
})
.command('build', 'Build production bundle', (yargs) => {
    yargs.positional('webpack-config', {
        type: 'string',
        describe: 'Path to webpack config',
    })
})
.help()
.argv;

const scripts = {
    static: (argv, cwd) => {
        // set fec config
        validateFECConfig(cwd)
        static(argv, cwd)
    },
    'patch-etc-hosts': patchHosts,
    dev: devScript,
    build: buildScript
};

const args = [ argv, cwd ];

function run() {
    if (!argv._.length || argv._.length === 0) {
        console.error('Script name name must be specified. Run fec --help for more information.');
        process.exit(1);
    }

    scripts[argv._[0]](...args);
}

run();
