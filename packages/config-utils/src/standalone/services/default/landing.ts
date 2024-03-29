import express from 'express';
import path from 'path';

type ServiceConfig = {
  path: string;
  register: (options: {
    app: express.Application;
    config: {
      landing: {
        path: string;
      };
    };
  }) => void;
};

const landingConfig: ServiceConfig = {
  path: 'https://github.com/redhatinsights/landing-page-frontend-build',
  register({ app, config }) {
    const staticLanding = express.static(config.landing.path);
    // This is needed because otherwise express will add a trailing slash
    // like "/silent-check-sso.html/" which is bad for keycloak JS
    app.get('(/beta)?/*.html', (req, res) => {
      const diskPath = path.join(config.landing.path, req.url.replace('/beta', ''));
      res.sendFile(diskPath);
    });
    app.use('(/beta)?/apps/landing', staticLanding);
  },
};

export default landingConfig;
