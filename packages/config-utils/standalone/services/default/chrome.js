const fs = require('fs');
const path = require('path');

const keycloakPort = 4001;

module.exports = ({ port }) => ({
    // Chrome handles its auth through keycloak
    services: {
        keycloak: {
            // https://hub.docker.com/r/jboss/keycloak/
            args: [
                `-p ${keycloakPort}:8080`,
                "-e KEYCLOAK_USER=admin",
                "-e KEYCLOAK_PASSWORD=admin",
                "-e DB_VENDOR=h2",
                `-v ${path.join(__dirname, 'keycloak/realm_export.json')}:/tmp/realm_export.json`,
                "jboss/keycloak",
                "-Dkeycloak.migration.action=import",
                "-Dkeycloak.migration.provider=singleFile",
                "-Dkeycloak.migration.file=/tmp/realm_export.json",
                "-Dkeycloak.migration.strategy=OVERWRITE_EXISTING",
            ]
        },
    },
    // Where to find build assets. Can be a local path.
    path: 'https://github.com/redhatinsights/insights-chrome-build',
    keycloakUri: `http://localhost:${port}`,
    context: [
      '/auth'
    ],
    target: `http://localhost:${keycloakPort}`
});

// Also called when `localChrome` set
module.exports.registerChrome = ({ app, chromePath, keycloakUri, https, proxyVerbose }) => {
    const esiRegex = /<\s*esi:include\s+src\s*=\s*"([^"]+)"\s*\/\s*>/gm;
    // Express middleware for <esi:include> tags
    // Inspiration: https://github.com/knpwrs/connect-static-transform
    app.use((req, res, next) => {
        const ext = path.extname(req.url);
        if (req.method === 'GET' && ['', '.hmt', '.html'].includes(ext)) {
            const oldWrite = res.write.bind(res);
            res.write = chunk => {
                if (res.getHeader('Content-Type').includes('text/html') && !res.headersSent && !res.writableEnded) {
                    if (chunk instanceof Buffer) {
                        chunk = chunk.toString();
                    }
                    if (typeof chunk === 'string') {
                        chunk = chunk.replace(esiRegex, (_match, file) => {
                            file = file.split('/').pop();
                            const snippet = path.resolve(chromePath, 'snippets', file);
                            if (proxyVerbose) {
                                console.log('esi', req.url, file);
                            }
                            return fs.readFileSync(snippet);
                        });
                        res.setHeader('Content-Length', chunk.length);
                    }
                }
                oldWrite(chunk);
            }
        }

        next();
    });
    // Serve files which respect `keycloakUri` and `https`.
    app.get('(/beta)?/apps/chrome/*', (req, res) => {
        const fileReq = req.url.replace('/beta', '').replace('/apps/chrome', '');
        const diskPath = path.join(chromePath, fileReq);
        if (!fs.existsSync(diskPath)) {
            if (proxyVerbose) {
                console.log('not using localChrome for', req.url);
            }
            return next(); // fallback to proxy
        }
        // These hardcoded strings for auth need to be changed at runtime:
        // https://github.com/redallen/insights-chrome/commit/de14093bd20105042f48627466d4fba17825a890
        if (req.url.endsWith('.js')) {
            let fileString = fs.readFileSync(diskPath, 'utf8');
            if (!https) {
                if (proxyVerbose) {
                    console.log('remove https',  req.url);
                }
                fileString = fileString
                    .replace(/secure=true;/gm, '')
                    .replace(/https:\/\//gm, 'http://');
            }
            if (keycloakUri) {
                if (proxyVerbose) {
                    console.log('inject keycloak',  req.url);
                }
                fileString = fileString
                  .replace(/http:\/\/sso.qa.redhat.com/gm, keycloakUri);
            }
            res.end(fileString);
        } else {
            res.sendFile(diskPath);
        }
    });
};
