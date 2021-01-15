const fse = require('fs-extra');
const glob = require('glob');
const path = require('path');

const root = process.cwd();

const foldersBlackList = [ '__snapshots__', '__mocks__' ];
const sourceFiles = glob.sync(`${root}/src/*/`).filter(item => !foldersBlackList.some(name => item.includes(name))).map(name => name.replace(/\/$/, ''));

async function createPackage(file) {
    const fileName = file.split('/').pop();
    const esmSource = glob.sync(`${root}/esm/${fileName}/**/index.js`)[0];
    const destFile = `${path.resolve(root, file.split('/src/').pop())}/package.json`;
    const esmRelative = path.relative(file.replace('/src', ''), esmSource);
    const content = {
        main: 'index.js',
        module: esmRelative
    };
    return fse.writeJSON(destFile, content);
}

async function generatePackages(files) {
    const cmds = files.map(createPackage);
    return Promise.all(cmds);
}

async function run(files) {
    try {
        await generatePackages(files);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

run(sourceFiles);
