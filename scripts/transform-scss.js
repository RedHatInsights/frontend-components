const fs = require('fs');
const glob = require('glob');

const root = process.cwd();

async function transformFiles() {
  const esmRoot = `${root}/**/*.js`;
  const files = glob.sync(esmRoot).filter((path) => !path.includes('/src/'));
  const cmds = files.map((file) => {
    let content = fs.readFileSync(file, { encoding: 'utf-8' });
    const isEsm = file.includes('/esm/');
    if (isEsm) {
      /**
       * For ESM module, tranform the CSS asset paht co CJS variant.
       * Referencing CSS in esm directories causes webpack to tree shake the assets leading to missing CSS rules in build output.
       */
      const prefix = file.split('/esm/').pop().split('/').shift();
      content = content.replaceAll(/(?<=^import )'\.\/(?=.*\.scss)/gm, `'../${prefix}/`);
    }
    content = content.replace(/\.scss(?=('))/, '.css');
    content = content.replace(/\.scss(?=("\)))/, '.css');
    return fs.writeFile(file, content, 'utf-8', function (err) {
      if (err) {
        throw err;
      }
    });
  });
  return Promise.all(cmds);
}

async function run() {
  try {
    await transformFiles();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
