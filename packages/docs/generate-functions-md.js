const glob = require('glob');
const path = require('path');
const fse = require('fs-extra');
const sortFile = require('./sort-files');

const mdDest = path.resolve(__dirname, './pages/fec/modules');

function getDescription(item) {
    if (item.kind === 'class' && item.classdesc.length > 0) {
        return item.classdesc;
    }

    return item.description;
}

function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') {
        return unsafe;
    }

    return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\|/g, '&#124;')
    .replace(/\*/g, '&#42;');
}

function getParamName(param) {
    return escapeHtml(`${param.name}${param.optional ? '' : '*'}`);
}

function getParamType(param) {
    return `<code>${escapeHtml(param.type.names.join('|'))}</code>`;
}

function getParamDefaultValue(param) {
    return `<code>${escapeHtml(param.defaultvalue ? param.defaultvalue : '')}</code>`;
}

function getParamDescription(param) {
    return param.description || '';
}

function createParams(item) {
    let content = '';
    if (item.params) {
        item.params.forEach(param => {
            content = `${content}\n|${getParamName(param)}|${getParamType(param)}|${getParamDefaultValue(param)}|${getParamDescription(param)}`;
        });
    }

    return content;
}

async function createItemMd(pathname, item, exampleName) {
    const examples = glob.sync(path.resolve(__dirname, `./examples/${exampleName}/*.js`));
    const description = getDescription(item);
    const params = createParams(item);
    let content = `# ${item.name}\n`;

    if (description) {
        content = `${content}\n${description}\n`;
    }

    if (examples.length > 0) {
        content = `import ExampleComponent from '@docs/example-component'\n\n${content}`;
        examples.forEach(example => {
            const fileName = example.split('/').pop().replace('.js', '');
            content =  `${content}\n<ExampleComponent source="${exampleName}/${fileName}" name="${fileName.replace('-', ' ')}" />\n`;
        });
    }

    if (params) {
        content = `${content}\n## Params\n|Name|Type|Default|Description|\n|---|---|---|---|${params}\n`;
    }

    return fse.writeFile(pathname, content);
}

async function generateMd(file, items) {
    const packageName = sortFile(file);
    const name = file.split('/').pop().replace('.js', '');
    if (!fse.existsSync(`${mdDest}/${packageName}`)) {
        fse.mkdirSync(`${mdDest}/${packageName}`);
    }

    const cmds = items.map(item => {
        const exampleName = `${name}-${item.name}`;
        return createItemMd(`${mdDest}/${packageName}/${exampleName}.md`, item, exampleName);
    });
    return Promise.all(cmds);
}

module.exports = generateMd;
