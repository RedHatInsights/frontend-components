const glob = require('glob');
const path = require('path');
const fse = require('fs-extra');

const source = path.resolve(__dirname, 'pages', 'chrome');
const target = path.resolve(__dirname, 'components/navigation/chrome-navigation.json');

const kebabToCamel = (str) =>
    str.replace(/^./, (char) => char.toUpperCase())
    .split('-')
    .join(' ')
    .split('.')
    .shift();

const run = () => {
    const files = glob.sync(`${source}/*.md`);
    const result = {
        index: {},
        items: []
    };

    files.forEach((file) => {
        const name = file.replace(/\.md$/, '').split('/').pop();
        if (name === 'index') {
            result.index = {
                title: 'Chrome',
                href: '/chrome'
            };
        } else {
            result.items.push({
                title: kebabToCamel(name),
                href: `/chrome/${name}`
            });

        }
    });

    fse.writeJSONSync(target, result, { spaces: '\t' });
};

module.exports = run;
