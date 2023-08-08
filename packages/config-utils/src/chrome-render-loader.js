/* eslint-disable max-len */
function chromeRenderLoader(source) {
  const loaderUtils = require('loader-utils');
  const options = loaderUtils.getOptions(this);
  return `document.getElementById('root').classList.add('${options.appName}');var isChrome2 = (!${options.skipChrome2} && window.insights && window.insights.chrome && window.insights.chrome.isChrome2) || false; if(!isChrome2){${source}}`;
}

module.exports = chromeRenderLoader;
