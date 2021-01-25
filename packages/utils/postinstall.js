const { readdirSync } = require('fs');
const { copySync } = require('fs-extra');

const getDirectories = source => readdirSync(source, { withFileTypes: true })
.filter(dirent => dirent.isDirectory())
.map(dirent => dirent.name);

copySync('./styles', './Utilities', (err) => err && console.log(err));

const files = getDirectories('./').filter(item => ![ 'esm', 'files', 'doc', 'src', 'node_modules' ].includes(item));

files.map(file => copySync(`./${file}`, `./files/${file}`));
files.map(file => copySync(`./${file}`, `./files/cjs/${file}`));
copySync('./esm', './files/esm');
copySync('./index.js', './files/index.js');
copySync('./index.js', './files/cjs/index.js');
