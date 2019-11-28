const { join } = require('path');
const { readFileSync } = require('fs');

const mapper = JSON.parse(readFileSync((join(__dirname, './fileMapper.json')))) || {};

module.exports = (name) => {
    return `@redhat-cloud-services/frontend-components/components/${mapper[name] || name}`;
};
