const fse = require('fs-extra');
const path = require('path');

async function copyLocales() {
    try {
        await fse.copy(path.resolve(__dirname, '../../locales'), path.resolve(__dirname, './locales'));
        await fse.copy(path.resolve(__dirname, '../../locales'), path.resolve(__dirname, './esm/locales'));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

}

copyLocales();
