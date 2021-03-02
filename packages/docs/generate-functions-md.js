const path = require('path');
const fse = require('fs-extra');
const sortFile = require('./sort-files');

const mdDest = path.resolve(__dirname, './pages');

function getDescription(item) {
    if (item.kind === 'class' && item.classdesc.length > 0) {
        return item.classdesc;
    }

    return item.description;
}

function escapeHtml(unsafe) {
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
    return escapeHtml(param.description || '');
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

async function createItemMd(pathname, item) {
    const description = getDescription(item);
    const params = createParams(item);
    let content = `# ${item.name}\n`;
    if (description) {
        content = `${content}\n${description}\n`;
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

    const cmds = items.map(item => createItemMd(`${mdDest}/${packageName}/${name}-${item.name}.md`, item));
    return Promise.all(cmds);
}

module.exports = generateMd;
