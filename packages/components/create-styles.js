const glob = require('glob');
const sass = require('sass');
const { resolve } = require('path');
const fse = require('fs-extra');
const packageImporter = require('node-sass-package-importer');

const packagePath = process.cwd();

let sassInputs;

try {
    sassInputs = glob.sync(resolve(packagePath, 'src/**/*.scss')).map(path => {
        const [ name, file ] = path.split('/').slice(path.split('/').length - 2);
        return {
            path,
            name,
            file
        };
    });

} catch (error) {
    console.error(error);
    process.exit(1);
}

const buildTarget = resolve(packagePath, 'components');

async function generateCss(fileMeta, target) {
    const outFile = resolve(packagePath, target, `${fileMeta.name}.css`);
    try {
        return sass.render({
            file: fileMeta.path,
            outFile,
            outputStyle: 'compressed',
            importer: packageImporter()
        }, function(err, result) {
            if (err) {
                console.error('err', err);
                throw err;
            }

            return fse.writeFile(outFile, result.css);
        });
    } catch (error) {
        throw error;
    }
}

async function generate(inputs, target) {
    try {
        const cmds = inputs.map(file => generateCss(file, target));
        return Promise.all(cmds);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

generate(sassInputs, buildTarget);
