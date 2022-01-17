const path = require('path');
const glob = require('glob');

/**
 * Function that searches for all patternfly styles in node_modules and outputs an webpack alias object to ignore found modules.
 * @param {string} root absolute directory path to root folder containig package.json
 * @returns {Object}
 */
const searchIgnoredStyles = (root) => {
  const modulesPath = path.join(root, 'node_modules/@patternfly/react-styles');
  return glob.sync(`${modulesPath}/**/*.css`).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: false,
    }),
    {}
  );
};

module.exports = searchIgnoredStyles;
