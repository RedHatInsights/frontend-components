/**
 * @fileoverview Rule to disallow relative imports from PF packages to improve treeskaing
 * @author Martin Marosi
 */
const pfPackages = ['@patternfly/react-icons', '@patternfly/react-core'];

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow relative imports from Patternfly packages',
      category: 'Possible build errors',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      avoidRelativeImport:
        'Avoid using relative imports from {{ package }}. Use direct import path to {{ source }}. Module may be found at {{ hint }}.',
      avoidImportingStyles: 'Avoid importing styles from {{ package }}. Styles are injected with components automatically.',
    },
  },
  create: function (context) {
    return {
      ImportDeclaration: function (codePath) {
        const importString = codePath.source.value;
        const pfImport = pfPackages.find((pckg) => importString.includes(pckg));
        if (pfImport && importString.match(/(css|scss|sass)/gim)) {
          context.report({
            node: codePath,
            messageId: 'avoidImportingStyles',
            data: {
              package: importString,
            },
            fix: function (fixer) {
              return fixer.remove(codePath.parent);
            },
          });
        }

        /**
         * Check if import is from PF package and if it directly matches the package name which means its relative import
         */
        if (pfImport && pfPackages.includes(importString)) {
          const fullImport = context.getSourceCode(codePath.parent).text;
          /**
           * Check if the import is not full import statement
           */
          if (!fullImport.includes('from')) {
            return;
          }
          /**
           * Determine correct variable for direct import
           */

          let variables = context.getDeclaredVariables(codePath);
          let varName = 'Unknown';
          if (variables.length > 0) {
            varName = variables[0].name;
          }

          context.report({
            node: codePath,
            messageId: 'avoidRelativeImport',
            data: {
              package: importString,
              source: varName,
              hint: `import { ${varName} } from '${importString}/dist/dynamic/components/${varName}'`,
            },
          });
        }
      },
    };
  },
};
