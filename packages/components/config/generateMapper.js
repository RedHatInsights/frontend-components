const { join } = require('path');
const { getDirectories } = require('../../../config/utils');
const util = require('util');
const fs = require('fs');
const readFile = (fileName) => util.promisify(fs.readFile)(fileName, 'utf8');
const writeFile = (fileName, data) => util.promisify(fs.writeFile)(fileName, data, 'utf8');
const writeJson = (fileName, data) => writeFile(fileName, JSON.stringify(data, null, 4) + '\n');
const copyFile = (input, out) => util.promisify(fs.copyFile)(input, out);

const output = join(__dirname, '../components/fileMapper.json');
const customNameOut = join(__dirname, '../components/customName.js');
const customNameIn = join(__dirname, '../src/customName.js');

const writeMapper = (mappedFiles) => {
    writeJson(
        output,
        mappedFiles.filter(obj => Object.entries(obj).length !== 0 && obj.constructor === Object).reduce((acc, curr) => ({
            ...acc,
            ...curr
        }), {})
    );
};

const moveCustomName = () => {
    copyFile(customNameIn, customNameOut);
};

const generateData = (file) => {
    return file.split('\n')
    .filter((item) => item.includes('export {'))
    .flatMap(item => {
        return item.match('{([^}]*)')[1]
        .replace(/default as/, '')
        .replace(/\s/g, '')
        .split(',');
    });
};

(async () => {
    const dirs = getDirectories(process.argv.slice(2)[0] || join(__dirname, '../src/Components'), '');

    const mappedFiles = await Promise.all(Object.entries(dirs).map(async ([ name, filePath ]) => {

        const exportName = name.substr(1, name.length);
        const data = generateData(await readFile(filePath));

        return data.filter(item => item !== exportName).reduce((acc, curr) => ({
            ...acc,
            [curr]: exportName
        }), {});
    }));

    writeMapper(mappedFiles);
    moveCustomName();
})();
