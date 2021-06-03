module.exports = {
    path: 'https://github.com/redhatinsights/cloud-services-config',
    context: '/config',
    selfHandleResponse: true,
    onProxyReq(_proxyReq, req, res, config) {
        const fileReq = req.url.replace('/condig', '');
        const diskPath = path.join(config.config.path, fileReq);
        res.sendFile(diskPath);
    }
};