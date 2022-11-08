const jsdocParser = require('jsdoc3-parser');
const path = require('path');
const fse = require('fs-extra');
const typedoc = require('typedoc');

const tempTsConfigPath = path.resolve(__dirname, 'temp/@@name.config.json');
const tsConfigPath = path.resolve(__dirname, 'temp/@@name.tsconfig.json');

function flattenChildren(child) {
  if (child.children?.length > 0) {
    return [child, ...child.children.map(flattenChildren)];
  }
  return [child];
}

function extractParams(node) {
  if (!node.signatures) {
    return [];
  }
  return node.signatures.map((signature) => {
    const { name, flags, comment, type } = signature;
    return {
      name,
      flags,
      comment,
      params: signature.parameters?.map(({ name, flags, type }) => ({ name, flags, type })),
      type: {
        name: type.name,
        type: type.type === 'reference' ? `<a href="#${type.name}" >${type.name}</a>` : type.type,
      },
    };
  });
}

function extractType(node) {
  let result = {
    title: node.name,
    comment: node.comment,
    type: node.kindString,
  };
  if (node.kindString === 'Method') {
    result.parameters = extractParams(node);
    result.type = 'function';
    result.flags = node.flags;
  } else if (node.kindString === 'Call signature') {
    result.parameters = extractParams({ ...node, signatures: [{ parameters: node.parameters, ...node.parameters[0] }] });
    result.type = 'function';
    result.flags = node.flags;
  } else if (node.kindString === 'Property') {
    if (node?.type?.type === 'reflection') {
      result.nested = node.type.declaration.children.map(extractType);
      result.type = 'object';
    } else {
      result.type = node?.type?.name || 'constant';
    }
  } else if (node.kindString === 'Type alias') {
    result = node.type.declaration.signatures.map((signature) => extractType({ ...signature, name: result.title })).pop();
  }
  return result;
}

function createTsItems(content, filename) {
  const flatChildren = content.children.flatMap(flattenChildren).flat();
  let root = content.children.find(({ name }) => name === 'default');
  root = {
    title: filename.replace(/\.tsx?$/, ''),
    parameters: extractParams(root),
    type: root.kindString === 'Function' ? 'function' : root.kindString,
  };
  root.parameters[0].name = root.title;

  try {
    return [root, ...flatChildren.map(extractType)].filter(({ title }) => title !== 'default');
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function parseTSFile(file) {
  let root = file.split('/');
  const tempName = root.pop();
  root = `${root.join('/').split('/src/').shift()}/src/`;
  const tempFile = path.resolve(__dirname, `./temp/${tempName}.json`);
  const fileTsConfigPath = tsConfigPath.replace('@@name', tempName);
  const fileTypedocConfigPath = tempTsConfigPath.replace('@@name', tempName);
  fse.outputJSONSync(fileTsConfigPath, {
    extends: path.resolve(__dirname, '../../../tsconfig.json'),
    compilerOptions: {
      rootDir: `${root}/`,
      downlevelIteration: true,
      allowJs: true,
    },
    include: [file],
  });
  const typedocApp = new typedoc.Application();
  typedocApp.options.addReader(new typedoc.TSConfigReader());
  typedocApp.options.addReader(new typedoc.TypeDocReader());
  typedocApp.bootstrap({
    entryPoints: file,
    json: tempFile,
    tsconfig: fileTsConfigPath,
    excludeExternals: true,
  });
  const project = typedocApp.convert();
  try {
    await typedocApp.generateJson(project, tempFile);
    const content = fse.readJSONSync(tempFile);
    fse.remove(tempFile);
    fse.remove(fileTsConfigPath);
    fse.remove(fileTypedocConfigPath);

    return {
      tsdoc: true,
      items: createTsItems(content, tempName),
      filename: tempName,
    };
  } catch (error) {
    console.log(error);
    return;
  }
}

// has to return a promise. jsdocParser returns undefined hence custom promise
const parseJSFile = async (file) => new Promise(res => {
  jsdocParser(file, (error, ast) => {
    if (error) {
      console.log(error);
      return;
    }

    if (!ast) {
      return;
    }

    try {
      const documented = ast.filter(({ undocumented, comment = '', scope }) => !undocumented && comment.length > 0 && scope === 'global');
      if (documented.length > 0) {
        return res({ jsdoc: true, items: documented });
      }
    } catch (error) {
      console.log(error, file);
    }

    return res();
  });
})

async function createJsdocContent(file) {
  try {
    if (file.match(/\.js$/)) {
      const result = await parseJSFile(file)
      return result;
    } else {
      return await parseTSFile(file);
    }
  } catch (error) {
    console.log(error);
    return;
  }
}

module.exports = createJsdocContent;
