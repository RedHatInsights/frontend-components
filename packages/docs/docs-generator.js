/* eslint-disable no-console */
/* eslint-disable max-len */
const path = require('path');
const fse = require('fs-extra');
const chokidar = require('chokidar');
const generateComponentsNavigation = require('./generate-components-nav');
const generateReactMD = require('./generate-react-md');
const generateFunctionsMd = require('./generate-functions-md');

const COMPONENTS_JSON = 'component-docs.json';

const navDest = path.resolve(__dirname, './components/navigation');

async function traverseComponents() {
    const components = fse.readJSONSync(path.resolve(__dirname, COMPONENTS_JSON));
    const foo = Object.entries(components);
    const cmds = foo.map(([ name, API ]) => {
        if (API.jsdoc) {
            return generateFunctionsMd(name, API.items);
        }

        return generateReactMD(name, API);
    });
    const componentsNav = generateComponentsNavigation(components);
    fse.writeJsonSync(`${navDest}/components-navigation.json`, componentsNav, { spaces: '\t' });
    return Promise.all(cmds);
}

async function run() {
    try {
        await traverseComponents();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const args = process.argv.slice(2);

console.log('Generating MD files for components.\n');
if (args.includes('-w') || args.includes('--watch')) {
    const target = path.resolve(__dirname, COMPONENTS_JSON);
    console.log(`Watching: ${path.resolve(__dirname, COMPONENTS_JSON)}`);
    const watcher = chokidar.watch(target);
    watcher.on('add', () => {
        run();
    }).on('change', () => {
        console.log(`Generating updated MD files`);
        run();
    });

} else {
    run();
}
