const { readdirSync } = require('fs');
const { join, parse } = require('path');

const getDirectories = (source, dest) =>
  readdirSync(source)
    .filter((name) => name.indexOf('utils') === -1)
    .map((name) => {
      const key = `${dest}/${name}`;
      return {
        [key]: './' + join(source, `${name}/index.js`),
      };
    })
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

const getAllFiles = (source, dest) =>
  readdirSync(source)
    .filter((fileName) => fileName !== 'index.js' && parse(fileName).ext === '.js')
    .reduce(
      (acc, name) => ({
        ...acc,
        [`${dest}/${parse(name).name}`]: './' + join(source, name),
      }),
      {}
    );

module.exports = {
  getDirectories,
  getAllFiles,
};
