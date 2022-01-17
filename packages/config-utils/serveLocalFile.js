/* eslint-disable no-console */
function serveLocalFile(url, path, target = 'https://ci.cloud.redhat.com') {
  console.warn("\x1b[33mserveLocalFile is deprecated in favor of hooking into webpack-dev-server's express app.");
  console.warn('See https://github.com/RedHatInsights/frontend-components/blob/master/packages/config/README.md#standalone');
  return {
    context: (path) => path.includes(url),
    target,
    secure: false,
    changeOrigin: true,
    autoRewrite: true,
    selfHandleResponse: true,
    onProxyReq: (_pr, _req, res) => {
      res.sendFile(path);
    },
  };
}

module.exports = serveLocalFile;
