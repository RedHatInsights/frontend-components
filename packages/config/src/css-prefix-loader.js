const loaderUtils = require('loader-utils');

module.exports = function(source, meta) {
    if (!meta) {
        return source;
    }

    const sources = meta.sources;
    const options = loaderUtils.getOptions(this);

    /**
    * catch pure node_modules assets but still prefix modules that import mixins from node_modules
    */
    if (!options.prefixModules && sources.every(path => path.includes('/node_modules/'))) {
        return source;
    }

    const result = source.replace(/^\s*\./gm, '.' + options.prefix + ' .');
    return result;
};
