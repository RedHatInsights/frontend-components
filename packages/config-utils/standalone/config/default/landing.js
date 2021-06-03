module.exports = {
    path: 'https://github.com/redhatinsights/landing-page-frontend-build',
    context: [
        '/apps/landing',
        '/index.html',
        '/maintenance.html',
        '/silent-check-sso.html',
        '/404.html'
    ],
    selfHandleResponse: true,
    onProxyReq(_proxyReq, req, _res, config) {
        const fileReq = req.url.replace('/apps/landing', '');
        const diskPath = path.join(config.landing.path, fileReq);
        res.sendFile(diskPath);
    }
};