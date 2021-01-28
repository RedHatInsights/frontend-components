/* eslint-disable no-console */
const path = require('path');
const reactDocs = require('react-docgen');
const glob = require('glob');
const fse = require('fs-extra');
const chokidar = require('chokidar');
const jsdocParser = require('jsdoc3-parser');

const COMPONENTS_JSON = 'component-docs.json';

const componentsSrc = path.resolve(__dirname, '../components/src');
const files = glob.sync(`${componentsSrc}/**/*.js`);

const args = process.argv.slice(2);

function parseArrayObject(param) {
    return param
    .replace(/^Array.<{/, '{')
    .replace(/}>$/, '}')
    .replace(',', ',\n')
    .replace(/^{/, '{\n')
    .replace(/}$/, '\n}')
    .replace(/(?<!:) /gm, '')
    .replace(/^(?!({|}))/gm, '  ');
}

function parseParam(param) {
    const copy = { ...param };
    if (param.type && param.type.names) {
        const names = param.type.names.map(name => {
            if (name.includes('Array.<{')) {
                return parseArrayObject(name);
            }

            return name;
        });
        copy.type.names = names;
    }

    return copy;
}

let content = {};
function parseFile(file, content) {
    return new Promise(resolve => {
        const src = fse.readFileSync(file, { encoding: 'utf-8' });
        try {
            const componentInfo = reactDocs.parse(src);
            content[file] = componentInfo;
            resolve();
        } catch (error) {
            if (!file.includes('index.js') && !file.includes('.test.js')) {
                jsdocParser(file, function(error, ast) {
                    if (error) {
                        console.log(error);
                    }

                    const documented = ast
                    .filter(({ undocumented, comment = '' }) => !undocumented && comment.includes('@generate'))
                    .map(({ name, description, params, returns }) => {
                        return {
                            name,
                            description,
                            params: params.map(parseParam),
                            returns: returns.map(parseParam)
                        };
                    });
                    const src = {
                        displayName: file.split('/').pop().replace('.js', ''),
                        jsdoc: true,
                        functions: documented
                    };
                    if (documented.length > 0) {
                        content[file] = src;

                    }

                    resolve();
                });
            } else {
                console.log('\x1b[33m%s\x1b[0m', error.message, `File: ${file}`);
                resolve();
            }

        }
    });
}

const target = path.resolve(__dirname, `./${COMPONENTS_JSON}`);

async function run(files) {
    content = {};
    const cmds = files.map(async file => {
        await parseFile(file, content);
    });
    await Promise.all(cmds);
    fse.writeJSONSync(target, content, { spaces: '\t' });
}

console.log('Generating react-docgen JSON\n');
if (args.includes('-w') || args.includes('--watch')) {
    console.log(`Watching ${files.length} JS files in: ${path.resolve(__dirname)}`);
    const watcher = chokidar.watch(files);
    watcher.on('change', path => {
        console.log(`Compiling file: ${path}`);
        const currentContent = fse.readJSONSync(target);
        parseFile(path, currentContent);
        fse.writeJSONSync(target, currentContent, { spaces: '\t' });
    });

} else {
    run(files);
}
