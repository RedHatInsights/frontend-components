/**
 * @fileoverview Rule to suggest using the shared axios to better error handling and reporting.
 * @author Muslimj0n Kholjuraev
 */

  module.exports = {
    meta: {
      type: 'suggestion',
      fixable: 'code',
      messages: {
        useSharedAxiosMessage: 'Avoid using axios in your project. Instead, use the shared axios instance with interceptors for better error handling and reporting'
      },
      docs: {
        description: 'Use the shared axios instance',
        url: 'https://github.com/RedHatInsights/frontend-components/blob/master/packages/utils/src/interceptors/interceptors.ts#L83',
        recommended: false,
      },
    },
    create: function (context) {
      return {
        ImportDeclaration: (codePath) => {
          if (codePath.source.value.includes('axios')) {
            context.report({
              node: codePath,
              messageId: 'useSharedAxiosMessage',
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
  