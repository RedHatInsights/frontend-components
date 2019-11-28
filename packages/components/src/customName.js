const util = require('util');
const { join } = require('path');
const fs = require('fs');
const readFile = (fileName) => util.promisify(fs.readFile)(fileName, 'utf8');
const readJson = (fileName) => readFile(fileName).then(JSON.parse);

const mapper = readJson(join(__dirname, './fileMapper.json')) || {};

module.exports = (name) => {
    return `@redhat-cloud-services/frontend-components/components/${mapper[name] || name}`;
};
