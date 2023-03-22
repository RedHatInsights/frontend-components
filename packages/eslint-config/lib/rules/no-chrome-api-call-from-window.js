module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      deprecateChromeApiCallFromWindow: 'Calling chrome API from the window object is deprecated.',
    },
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    return {
      Identifier(node) {
        if (node?.name === 'window' && node?.parent?.property?.name === 'insights' && node?.parent?.parent?.property?.name === 'chrome') {
          context.report({ node, messageId: 'deprecateChromeApiCallFromWindow' });
        }
      },
    };
  },
};
