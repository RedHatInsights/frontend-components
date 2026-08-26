// Lightweight test-time stub for sanitize-html.
//
// sanitize-html@2.x bundles several pure-ESM nested dependencies
// (htmlparser2@12, entities@8, domelementtype@3, domhandler@6, dom-serializer@3,
// domutils@4) that Jest cannot parse without enabling full ESM mode.
// Rather than adding every nested package to transformIgnorePatterns, we simply
// replace the package with an identity function for the test environment.
// Components that use sanitize-html only need it to return a string, so this
// stub is sufficient for all current test cases.
'use strict';

const sanitizeHtml = (html) => html;

// Markdown.js reads sanitizeHtml.defaults.allowedAttributes — keep the shape intact.
sanitizeHtml.defaults = {
  allowedAttributes: {},
  allowedTags: [],
  allowedSchemes: [],
};

// TemplateProcessor imports the named export `simpleTransform`.
sanitizeHtml.simpleTransform = (tagName, attribs) => ({ tagName, attribs });

module.exports = sanitizeHtml;
module.exports.default = sanitizeHtml;
