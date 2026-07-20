/**
 * @fileoverview Rule to disallow importing components already migrated to @patternfly/react-component-groups
 * @author Filip Hlavac
 */

// Please add any components moved to the @patternfly/react-component-groups repo from this one
const forbiddenImports = ['ErrorBoundary', 'ErrorState', 'NotAuthorized'];

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow already migrated components',
      category: 'Possible run errors',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    return {
      ImportDeclaration(node) {
        const sourceValue = node.source.value;
        const specifiers = node.specifiers;
        const patternflyPackage = '@patternfly/react-component-groups';
        if (sourceValue === '@redhat-cloud-services/frontend-components') {
          specifiers.forEach((specifier) => {
            if (specifier.type === 'ImportDefaultSpecifier' && forbiddenImports.includes(specifier.local.name)) {
              context.report({
                node,
                message: `Importing ${specifier.local.name} from ${sourceValue} is deprecated, use import from ${patternflyPackage} instead.`,
                fix(fixer) {
                  const importStatement = `import ${specifier.local.name} from '${patternflyPackage}';`;
                  return fixer.replaceText(node, importStatement);
                },
              });
            } else if (specifier.type === 'ImportSpecifier' && forbiddenImports.includes(specifier.imported.name)) {
              context.report({
                node,
                message: `Importing ${specifier.imported.name} from ${sourceValue} is deprecated, use import from ${patternflyPackage} instead.`,
                fix(fixer) {
                  const importStatement = `import { ${specifier.imported.name} } from '${patternflyPackage}';`;
                  return fixer.replaceText(node, importStatement);
                },
              });
            }
          });
        }
      },
    };
  },
};
