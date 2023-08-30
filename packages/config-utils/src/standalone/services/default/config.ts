import express, { Application } from 'express';

const config = {
  path: 'https://github.com/redhatinsights/cloud-services-config',
  register({
    app,
    config,
  }: {
    app: Application;
    config: {
      config: {
        path: string;
      };
    };
  }) {
    const staticConfig = express.static(config.config.path);
    app.use('(/beta)?/config', staticConfig);
  },
};

export default config;
