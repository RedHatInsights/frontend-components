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
    target: `http://localhost:${keycloakPort}`,
    register({ app, config }) {
        const { path: chromePath, keycloakUri } = config.chrome;
        app.get('(/beta)?/apps/chrome/*', (req, res) => {
          const fileReq = req.url.replace('/beta', '').replace('/apps/chrome', '');
          const diskPath = path.join(process.cwd(), chromePath, fileReq);
          if (!fs.existsSync(diskPath)) {
              return res.status(404).end();
          }
          // These hardcoded strings for auth that need to be changed at runtime:
          // https://github.com/redallen/insights-chrome/commit/de14093bd20105042f48627466d4fba17825a890
          if (req.url.endsWith('.js')) {
              let fileString = fs.readFileSync(diskPath, 'utf8');
              fileString = fileString
                  .replace(/secure=true;/gm, '')
                  // This part gets minified weird. Let's just nuke https to http
                  .replace(/https:\/\//gm, 'http://');
              if (keycloakUri) {
                  fileString = fileString
                    .replace(/http:\/\/sso.qa.redhat.com/gm, keycloakUri);
              }
              res.end(fileString);
          } else {
              res.sendFile(diskPath);
          }
        });
    }
});
