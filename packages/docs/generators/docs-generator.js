/* eslint-disable no-console */
/* eslint-disable max-len */
const path = require('path');
const fse = require('fs-extra');
const chokidar = require('chokidar');
const generateComponentsNavigation = require('./generate-components-nav');
const generateReactMD = require('./generate-react-md');
const generateFunctionsMd = require('./generate-functions-md');
const generateTsFunctionsMd = require('./generate-ts-functions-md');

const COMPONENTS_JSON = 'component-docs.json';
const EXAMPLES_LOCATION = path.resolve(__dirname, '../examples');

const navDest = path.resolve(__dirname, '../components/navigation');

async function traverseComponents() {
  const components = fse.readJSONSync(path.resolve(__dirname, COMPONENTS_JSON));
  const foo = Object.entries(components);
  const cmds = foo.map(([name, API]) => {
    if (API.jsdoc) {
      return generateFunctionsMd(name, API.items);
    } else if (API.tsdoc) {
      return generateTsFunctionsMd(name, API);
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
  const target = [path.resolve(__dirname, COMPONENTS_JSON), EXAMPLES_LOCATION];
  console.log(`Watching: ${target}`);
  const watcher = chokidar.watch(target);
  watcher
    .on('add', () => {
      run();
    })
    .on('change', () => {
      console.log(`Generating updated MD files`);
      /**
       * This timeout is required to wait until the file changes are commited.
       * The FSE is trying to read the file before it was saved and can cause crashes
       */
      setTimeout(() => {
        run();
      }, 250);
    });
} else {
  run();
}
