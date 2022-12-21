/**
 * @fileoverview Rule to warn about deprecated packages.
 * @author Karel Hala
 */

const deprecatedPackages = {
  '@redhat-cloud-services/frontend-components-pdf-generator': {
    hint: 'https://github.com/RedHatInsights/pdf-generator',
  },
};

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow deprecated packages',
      category: 'Possible run errors',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      avoidUsingDeprecatedWithHint: 'Avoid using deprecated package {{ package }}. More info can be found at {{ hint }}.',
      avoidUsingDeprecated: 'Avoid using deprecated package {{ package }}.',
    },
  },
  create: function (context) {
    return {
      ImportDeclaration: (codePath) => {
        const [deprecatedImport, data] = Object.entries(deprecatedPackages).find(([pckg]) => codePath.source.value.includes(pckg)) || [];
        if (deprecatedImport) {
          context.report({
            node: codePath,
            messageId: data.hint ? 'avoidUsingDeprecatedWithHint' : 'avoidUsingDeprecated',
            data: {
              package: codePath.source.value,
              ...data,
            },
          });
        }
      },
    };
  },
};
