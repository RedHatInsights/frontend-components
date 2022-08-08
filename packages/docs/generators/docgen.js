/* eslint-disable no-console */
const path = require('path');
const reactDocs = require('react-docgen');
const glob = require('glob');
const fse = require('fs-extra');
const chokidar = require('chokidar');
const createJsdocContent = require('./functions-generator');
const fcHandler = require('./react-docgen-fc-handler');

const COMPONENTS_JSON = 'component-docs.json';

const DEFAULT_TS_BABEL_OPTIONS = {
  configFile: path.resolve(__dirname, 'docgen.babelrc'),
  root: __dirname,
};

const componentsSrc = path.resolve(__dirname, '../../*/src');
const files = glob
  .sync(`${componentsSrc}/**/*.{js,ts,tsx}`)
  .filter((file) => !file.match(/((\.d\.ts)|(test|spec|index)\.(js|ts|tsx)|(\/__mock__\/|\/__mocks__\/|\/test\/))/gim));

const args = process.argv.slice(2);

async function parseFile(file) {
  const src = fse.readFileSync(file, { encoding: 'utf-8' });
  try {
    const componentInfo = reactDocs.parse(
      src,
      undefined,
      [fcHandler, ...reactDocs.defaultHandlers],
      file.match(/.*\.tsx?$/) ? { ...DEFAULT_TS_BABEL_OPTIONS, filename: file } : undefined
    );
    return componentInfo;
  } catch (error) {
    if (error.message.includes('No suitable component definition found')) {
      const jsdocContent = await createJsdocContent(file);
      if (jsdocContent) {
        return jsdocContent;
      }
    } else {
      console.log('\x1b[33m%s\x1b[0m', error.message, `File: ${file}`);
    }
  }
}

const componentsTarget = path.resolve(__dirname, `./${COMPONENTS_JSON}`);

const appendToJSON = async (file, contentToAppend) => {
  const fileJSON = fse.readJSONSync(file);
  if (typeof fileJSON === typeof contentToAppend) {
    const newFileJSON = Array.isArray(fileJSON) ? [...fileJSON, ...contentToAppend] : { ...fileJSON, ...contentToAppend };
    fse.writeJSONSync(componentsTarget, newFileJSON, { spaces: '\t' });
  }
};

async function run(files) {
  fse.writeJSONSync(componentsTarget, {}, { spaces: '\t' });

  for (const file of files) {
    const contents = await parseFile(file);
    await appendToJSON(componentsTarget, {
      [file]: contents,
    });
  }
}

console.log('Generating react-docgen JSON\n');
if (args.includes('-w') || args.includes('--watch')) {
  console.log(`Watching ${files.length} JS files in: ${path.resolve(__dirname, '../')}`);
  const watcher = chokidar.watch(files);
  watcher.on('change', async (path) => {
    console.log(`Compiling file: ${path}`);
    const contents = await parseFile(path);
    await appendToJSON(componentsTarget, {
      [path]: contents,
    });
  });
} else {
  run(files);
}
