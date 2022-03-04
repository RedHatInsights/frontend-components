/**
 * @fileoverview Rule to disallow relative imports from FEC packages to improve treeskaing
 * @author Martin Marosi
 */

const FECPackages = [
  '@redhat-cloud-services/frontend-components-charts',
  '@redhat-cloud-services/frontend-components',
  '@redhat-cloud-services/frontend-components-config',
  '@redhat-cloud-services/frontend-components-demo',
  '@redhat-cloud-services/eslint-config-redhat-cloud-services',
  '@redhat-cloud-services/frontend-components-notifications',
  '@redhat-cloud-services/frontend-components-pdf-generator',
  '@redhat-cloud-services/frontend-components-remediations',
  '@redhat-cloud-services/rule-components',
  '@redhat-cloud-services/frontend-components-translations',
  '@redhat-cloud-services/frontend-components-utilities',
];

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow relative imports from FEC packages',
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
        const fecImport = FECPackages.find((pckg) => importString.includes(pckg));
        if (fecImport && importString.match(/(css|scss|sass)/gim)) {
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
         * Check if import is from FEC package and if it directly matches the package name which means its relative import
         */
        if (fecImport && FECPackages.includes(importString)) {
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
              hint: `import ${varName} from '${importString}/${varName}'`,
            },
            fix: function (fixer) {
              const newText = variables.map(function (data) {
                return `import ${data.name} from "${importString}/${data.name}"`;
              });
              return fixer.replaceText(codePath, newText.join('\n'));
            },
          });
        }
      },
    };
  },
};
