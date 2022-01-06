const jsdocParser = require('jsdoc3-parser');
const path = require('path');
const fse = require('fs-extra');
const { exec } = require('child_process');

async function parseTSFile(file) {
    return new Promise((resolve, reject) => {
        const tempFile = path.resolve(__dirname, `./temp${file}.json`);

        const execString = `npm run typedoc -- --entryPoints ${file} --json ${tempFile}`;
        exec(execString, (err) => {
            if (err) {
                reject(err);
            }

            const content = fse.readJSONSync(tempFile);
            fse.removeSync(tempFile);
            return resolve({
                tsdoc: true,
                content
            });
        });
    });
}

async function parseJSFile(file) {
    return new Promise(resolve => {
        return jsdocParser(file, function(error, ast) {
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
            fileContent = await(parseJSFile(file));
        } else {
            fileContent = await(parseTSFile(file));
        }

        return fileContent;
    } catch (error) {
        console.log(error);
        return {};
    }
}

module.exports = createJsdocContent;
