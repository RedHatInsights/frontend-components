const fs = require('fs');
const path = require('path');
const glob = require('glob');

const keycloakPort = process.env['KEYCLOAK_PORT'] ? process.env['KEYCLOAK_PORT'] : 4001;

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
    // Unfortunately we have to alter the contents of ALL text/html responses like akamai
    // This means modifying the response object directly.
    app.use((req, res, next) => {
        const ext = path.extname(req.url.replace(/\?.*/, ''));
        if (req.method === 'GET' && ['', '.hmt', '.html'].includes(ext)) {
            // We can't handle encoded responses without a big gzip/zip/br dependency
            delete req.headers['accept-encoding'];
            function writeOrEnd(chunk, encoding, callback, oldFn) {
                const ctype = res.getHeader('Content-Type');
                if (ctype && ctype.includes('text/html') && !res.headersSent && !res.writableEnded) {
                    if (chunk instanceof Buffer) {
                        chunk = chunk.toString();
                    }
                    if (typeof chunk === 'string') {
                        let hasEsi = false;
                        chunk = chunk.replace(esiRegex, (_match, file) => {
                            file = file.split('/').pop();
                            const snippet = path.resolve(chromePath, 'snippets', file);
                            if (proxyVerbose) {
                                console.log('esi', req.url, file);
                            }
                            hasEsi = true;
                            return fs.readFileSync(snippet);
                        });
                        // Assumption: the response won't be chunked.
                        if (hasEsi) {
                            res.setHeader('Content-Length', chunk.length);
                        }
                    }
                }
                return oldFn(chunk, encoding, callback);
            };
            // https://nodejs.org/api/http.html#http_class_http_serverresponse
            const oldWrite = res.write.bind(res);
            res.write = (chunk, encoding, callback) => writeOrEnd(chunk, encoding, callback, oldWrite);
            const oldEnd = res.end.bind(res);
            res.end = (chunk, encoding, callback) => writeOrEnd(chunk, encoding, callback, oldEnd);
        }

        next();
    });
    // Serve files which respect `keycloakUri` and `https`.
    app.get('(/beta)?/apps/chrome/*', (req, res) => {
        const fileReq = req.url.replace('/beta', '').replace('/apps/chrome', '');
        let diskPath = path.join(chromePath, fileReq);
        if (!fs.existsSync(diskPath)) {
            // Try ignoring the SHA in `/*.SHA.ext`
            if (diskPath.match(/\/[^\/]+\.[^\/]+\.[^\/]+$/)) {
              diskPath = diskPath.replace(/\w+\.(\w+)$/, (_, m) => `*${m}`);
            }
            const localFiles = glob.sync(diskPath);
            if (localFiles.length === 1) {
                diskPath = localFiles[0];
                if (proxyVerbose) {
                  console.log('localChrome', req.url, '->', diskPath);
                }
            } else if (proxyVerbose) {
                console.log('not using localChrome for', req.url, `(could not find ${diskPath})`);
                return next(); // fallback to proxy
            }
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
                  .replace(/https?:\/\/sso.qa.redhat.com/gm, keycloakUri);
            }
            res.end(fileString);
        } else {
            res.sendFile(diskPath);
        }
    });
};
