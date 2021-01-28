/* eslint-disable no-console */
const path = require('path');
const reactDocs = require('react-docgen');
const glob = require('glob');
const fse = require('fs-extra');
const chokidar = require('chokidar');

const COMPONENTS_JSON = 'component-docs.json';

const componentsSrc = path.resolve(__dirname, '../components/src');
const files = glob.sync(`${componentsSrc}/**/*.js`);

const args = process.argv.slice(2);

let content = {};
function parseFile(file, content) {
    const src = fse.readFileSync(file, { encoding: 'utf-8' });
    try {
        const componentInfo = reactDocs.parse(src);
        content[file] = componentInfo;
    } catch (error) {
        console.log('\x1b[33m%s\x1b[0m', error.message, `File: ${file}`);
    }
}

const target = path.resolve(__dirname, `./${COMPONENTS_JSON}`);

function run(files) {
    content = {};
    files.forEach(file => {
        parseFile(file, content);
    });
    fse.writeJSONSync(target, content, { spaces: '\t' });
}

console.log('Generating react-docgen JSON\n');
if (args.includes('-w') || args.includes('--watch')) {
    console.log(`Watching ${files.length} JS files in: ${path.resolve(__dirname)}`);
    const watcher = chokidar.watch(files);
    watcher.on('change', path => {
        console.log(`Compiling file: ${path}`);
        const currentContent = fse.readJSONSync(target);
        parseFile(path, currentContent);
        fse.writeJSONSync(target, currentContent, { spaces: '\t' });
    });

} else {
    run(files);
}
