const nodePath = require('path');
const sassExt = /\.s[ac]ss$/;

module.exports = function (babel) {
    const { types: t } = babel;
    return {
        visitor: {
            ImportDeclaration: function(path, state) {
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
                    let relative = nodePath.relative(this.filename.replace('/src/', '/esm/'), this.filename.replace('/src', '')).replace(/^..\//, '').split('/');
                    relative.pop();
                    relative = relative.join('/');
                    cssSourcePath =  `${relative}/${sassFileName}`;
                } else {
                    cssSourcePath = `${sassFileName}`;
                }

                path.replaceWith(t.importDeclaration(path.node.specifiers, t.stringLiteral(cssSourcePath)));
            },
            /**
                 * In RuleTable component there is the style file reexported
                 * for esm, we need to change the source path
                 */
            ExportDeclaration: function(path, state) {
                /**
                 * skip default export
                 */
                if (!path.node.source) {
                    return;
                }

                /**
                 * skip files with no sass exports
                 */
                if (!sassExt.test(path.node.source.value)) {
                    return;
                }

                /**
                 * replace sass extenstion with css extension
                 */
                const sassFileName = path.node.source.value.replace(sassExt, '.css');
                /**
                 * replace sass export with css import
                 */
                let cssSourcePath;
                if (state.opts.esm === true) {
                    /**
                     * Get root folder for ESM reference
                     */
                    let relative = nodePath.relative(this.filename.replace('/src/', '/esm/'), this.filename.replace('/src', '')).replace(/^..\//, '').split('/');
                    relative.pop();
                    relative = relative.join('/');
                    cssSourcePath =  `${relative}/${sassFileName}`;
                } else {
                    cssSourcePath = `${sassFileName}`;
                }

                /**
                     * Change the export to new path
                     */
                path.replaceWith(t.exportNamedDeclaration(path.node.declarations, path.node.specifiers, t.stringLiteral(cssSourcePath)));
            }
        }
    };
};
