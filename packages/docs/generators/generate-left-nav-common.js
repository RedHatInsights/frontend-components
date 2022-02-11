const fse = require('fs-extra');
const path = require('path');
const glob = require('glob');

const PAGES_PATH = path.resolve(__dirname, '../pages');

const folders = glob.sync(`${PAGES_PATH}/*`).filter((name) => !name.match(/(\.js$|fec)/));

const kebabToCamel = (str) =>
  str
    .replace(/^./, (char) => char.toUpperCase())
    .split('-')
    .join(' ')
    .split('.')
    .shift();

function generateNav(bucket) {
  const files = glob.sync(`${bucket}/*`);
  const prefix = bucket.split('/').pop();
  const target = path.resolve(__dirname, `../components/navigation/${prefix}-navigation.json`);
  const result = {
    index: {},
    items: [],
  };
  files.forEach((file) => {
    const name = file.replace(/\.md$/, '').split('/').pop();
    if (name === 'index') {
      result.index = {
        title: kebabToCamel(prefix),
        href: `/${prefix}`,
      };
    } else {
      result.items.push({
        title: kebabToCamel(name),
        href: `/${prefix}/${name}`,
      });
    }
  });
  fse.writeJSONSync(target, result, { spaces: '\t' });
}

function run() {
  folders.forEach((bucket) => {
    generateNav(bucket);
  });
}

run();
