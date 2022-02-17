const jsdocParser = require('jsdoc3-parser');
const path = require('path');
const fse = require('fs-extra');
const { exec } = require('child_process');

const tempTsConfigPath = path.resolve(__dirname, 'temp/@@name.config.json');
const tsConfigPath = path.resolve(__dirname, 'temp/@@name.tsconfig.json');

console.log({ tsConfigPath });

async function parseTSFile(file) {
  let root = file.split('/');
  const tempName = root.pop();
  root = root.join('/');
  const tempFile = path.resolve(__dirname, `./temp/${tempName}.json`);
  const fileTsConfigPath = tsConfigPath.replace('@@name', tempName);
  const fileTypedocConfigPath = tempTsConfigPath.replace('@@name', tempName);
  fse.outputJSONSync(fileTypedocConfigPath, {
    entryPoints: file,
    json: tempFile,
    tsconfig: fileTsConfigPath,
    excludeExternals: true,
  });
  fse.outputJSONSync(fileTsConfigPath, {
    extends: path.resolve(__dirname, '../../../tsconfig.json'),
    compilerOptions: {
      rootDir: root,
      downlevelIteration: true,
      allowJs: true,
    },
    include: [file],
  });

  return new Promise((resolve) => {
    const execString = `npm run typedoc -- --options ${fileTypedocConfigPath}`;
    exec(execString, (err) => {
      if (err) {
        console.log(err);
        /**
         * TODO: Once everything relevant is migrated to TS reject the promise
         */
        return resolve();
      }

      try {
        const content = fse.readJSONSync(tempFile);
        console.log(content.children.find(({ name }) => name === 'default'));
        fse.removeSync(tempFile);
        fse.removeSync(fileTsConfigPath);
        fse.removeSync(fileTypedocConfigPath);
        return resolve({
          tsdoc: true,
          content: content.children.find(({ name }) => name === 'default'),
        });
      } catch (error) {
        console.log(err);
        return resolve();
      }
    });
  });
}

async function parseJSFile(file) {
  return new Promise((resolve) => {
    return jsdocParser(file, function (error, ast) {
      if (error) {
        console.log(error);
      }

      if (!ast) {
        return resolve();
      }

      try {
        const documented = ast.filter(({ undocumented, comment = '', scope }) => !undocumented && comment.length > 0 && scope === 'global');
        if (documented.length > 0) {
          return resolve({ jsdoc: true, items: documented });
        }

        return resolve();
      } catch (error) {
        console.log(error, file);
        return resolve();
      }
    });
  });
}

async function createJsdocContent(file) {
  try {
    let fileContent;
    if (file.match(/\.js$/)) {
      fileContent = await parseJSFile(file);
    } else {
      fileContent = await parseTSFile(file);
    }

    return fileContent;
  } catch (error) {
    console.log(error);
    return {};
  }
}

module.exports = createJsdocContent;
