#!/usr/bin/env node

const static = require('@redhat-cloud-services/frontend-components-config-utilities/serve-federated');
const yargs = require('yargs');

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
.help()
.argv;

const scripts = {
    static
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
