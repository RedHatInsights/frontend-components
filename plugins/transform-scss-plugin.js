const nodePath = require('path');
const sassExt = /\.s[ac]ss$/;

module.exports = function (babel) {
  const { types: t } = babel;
  return {
    visitor: {
      ImportDeclaration: function (path, state) {
        /**
         * skip files with no sass imports
         */
        if (!sassExt.test(path.node.source.value)) {
          return;
        }

        /**
         * replace sass extenstion with css extension
         */
        const sassFileName = path.node.source.value.replace(sassExt, '.css');
        /**
         * replace sass import with css import
         */
        let cssSourcePath;
        if (state.opts.esm === true) {
          /**
           * Get root folder for ESM reference
           */
          let relative = nodePath
            .relative(this.filename.replace('/src/', '/esm/'), this.filename.replace('/src', ''))
            .replace(/^..\//, '')
            .split('/');
          relative.pop();
          relative = relative.join('/');
          cssSourcePath = `${relative}/${sassFileName}`;
        } else {
          cssSourcePath = `${sassFileName}`;
        }

        path.replaceWith(t.importDeclaration(path.node.specifiers, t.stringLiteral(cssSourcePath)));
      },
    },
  };
};
