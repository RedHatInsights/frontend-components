/* eslint-disable no-console */
const path = require('path');
const reactDocs = require('react-docgen');
const glob = require('glob');
const fse = require('fs-extra');
const chokidar = require('chokidar');
const createJsdocContent = require('./functions-generator');

const COMPONENTS_JSON = 'component-docs.json';

const DEFAULT_TS_BABEL_OPTIONS = {
  configFile: '../.docgen.babelrc',
  root: __dirname,
};

const componentsSrc = path.resolve(__dirname, '../../*/src');
const files = glob
  .sync(`${componentsSrc}/**/*.{js,ts,tsx}`)
  .filter((file) => !file.match(/((\.d\.ts)|(test|spec|index)\.(js|ts|tsx)|(\/__mock__\/|\/__mocks__\/|\/test\/))/gim));

const args = process.argv.slice(2);

let content = {};
async function parseFile(file, content) {
  const src = fse.readFileSync(file, { encoding: 'utf-8' });
  try {
    const componentInfo = reactDocs.parse(
      src,
      undefined,
      undefined,
      file.match(/.*\.tsx?$/) ? { ...DEFAULT_TS_BABEL_OPTIONS, filename: file } : undefined
    );
    content[file] = componentInfo;
  } catch (error) {
    if (error.message.includes('No suitable component definition found')) {
      const jsdocContent = await createJsdocContent(file);
      if (jsdocContent) {
        content[file] = jsdocContent;
      }
    } else {
      console.log('\x1b[33m%s\x1b[0m', error.message, `File: ${file}`);
    }
  }
}

const componentsTarget = path.resolve(__dirname, `./${COMPONENTS_JSON}`);

async function run(files) {
  content = {};
  const cmds = files.map((file) => {
    return parseFile(file, content);
  });
  await Promise.all(cmds);
  fse.writeJSONSync(componentsTarget, content, { spaces: '\t' });
}

console.log('Generating react-docgen JSON\n');
if (args.includes('-w') || args.includes('--watch')) {
  console.log(`Watching ${files.length} JS files in: ${path.resolve(__dirname, '../')}`);
  const watcher = chokidar.watch(files);
  watcher.on('change', async (path) => {
    console.log(`Compiling file: ${path}`);
    const currentContent = fse.readJSONSync(componentsTarget);
    await parseFile(path, currentContent);
    fse.writeJSONSync(componentsTarget, currentContent, { spaces: '\t' });
  });
} else {
  run(files);
}
