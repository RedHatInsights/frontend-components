function serveLocalFile(url, path, target = 'https://ci.cloud.redhat.com') {
    return {
        context: (path) => path.includes(url),
        target,
        secure: false,
        changeOrigin: true,
        autoRewrite: true,
        selfHandleResponse: true,
        onProxyReq: (_pr, _req, res) => {
            res.sendFile(path);
        }
    };
}

module.exports = serveLocalFile;
