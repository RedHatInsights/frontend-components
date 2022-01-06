const jsdocParser = require('jsdoc3-parser');

async function parseFile(file) {
    console.log(file);
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
        const fileContent = await(parseFile(file));
        return fileContent;
    } catch (error) {
        console.log(error);
        return {};
    }
}

module.exports = createJsdocContent;
