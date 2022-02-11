const path = require('path');
const fse = require('fs-extra');
const sortFile = require('./sort-files');

const mdDest = path.resolve(__dirname, '../pages/fec/modules');

async function generateTsFunctionsMd(file) {
  const packageName = sortFile(file);
  const name = file
    .split('/')
    .pop()
    .replace(/\.tsx?$/, '');
  if (!fse.existsSync(`${mdDest}/${packageName}`)) {
    fse.mkdirSync(`${mdDest}/${packageName}`);
  }

  console.log('Processing unsupported TS file', file, '/n');
  const content = '# TS not supported yet';
  const cmds = [fse.writeFile(`${mdDest}/${packageName}/${name}.md`, content)];
  return Promise.all(cmds);
}

module.exports = generateTsFunctionsMd;
