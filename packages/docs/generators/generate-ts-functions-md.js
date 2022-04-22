const path = require('path');
const fse = require('fs-extra');
const sortFile = require('./sort-files');

const mdDest = path.resolve(__dirname, '../pages/fec/modules');

function generateFunctionParamSignature(param) {
  let result = `${param.name}${param?.flags?.isOptional ? '?' : ''}`;
  if (param?.type?.type === 'array') {
    result = result.concat(`: ${param.type.elementType.name}[]`);
  } else {
    result = result.concat(`: ${param.type.name}`);
  }
  if (param.flags.isRest) {
    result = `...${result}`;
  }
  return result;
}

function generateFunctions(parameters = []) {
  if (parameters.length === 0) {
    return '';
  }

  let result = '';
  parameters.forEach(({ name, type, comment, params = [] }) => {
    const functionArguments = params.map(generateFunctionParamSignature).join(', ');
    const signature = `\`\`\`typescript
declare function ${name}(${functionArguments}): ${type?.name || 'void'}
\`\`\``;
    result = result.concat(`${comment?.shortText ? `\n${comment?.shortText}` : ''}\n${signature}\n`);
  });

  return result;
}

//TODO: Make the tags fancy
function generateTag({ tag, text }) {
  return `\n**${tag}**\n${text}\n`;
}

function generateItem(item, level = 2) {
  let result = `${[...Array(level)].map(() => '#').join('')} ${item.title}\n **type**: \`${item.type}\`\n`;

  if (Array.isArray(item?.comment?.tags)) {
    item.comment.tags.forEach((tag) => {
      result = result.concat(generateTag(tag));
    });
  }

  if (typeof item?.comment?.shortText === 'string') {
    result = result.concat(`\n${item?.comment?.shortText}\n`);
  }

  if (item.type === 'function') {
    result = result.concat(generateFunctions(item.parameters));
  }
  if (Array.isArray(item.nested)) {
    item.nested.forEach((nestedItem) => {
      result = result.concat(generateItem({ ...nestedItem, title: `\`${item.title}.${nestedItem.title}\`` }, level + 1));
    });
  }

  return result;
}

async function generateTsFunctionsMd(file, API) {
  const packageName = sortFile(file);
  const name = file
    .split('/')
    .pop()
    .replace(/\.tsx?$/, '');

  fse.ensureDirSync(`${mdDest}/${packageName}`);

  const title = API.filename.replace('.ts', '');

  let content = `# ${title}\n`;
  content = content.concat(`\n${API.items.map((item) => generateItem(item)).join('\n')}`);
  const cmds = [fse.writeFile(`${mdDest}/${packageName}/${name}.mdx`, content)];
  return Promise.all(cmds);
}

module.exports = generateTsFunctionsMd;
