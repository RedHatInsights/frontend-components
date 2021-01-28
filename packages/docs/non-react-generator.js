const path = require('path');
const fse = require('fs-extra');

const componentsDest = path.resolve(__dirname, './pages/components');

async function nonReactGenerator(name, api) {
    const content = `# ${api.displayName}`;
    let destName = name.split('/');
    destName = destName.slice(destName.length - 2).join('-').replace('.js', '');
    return fse.writeFile(`${componentsDest}/${destName}.md`, content);
}

module.exports = nonReactGenerator;
