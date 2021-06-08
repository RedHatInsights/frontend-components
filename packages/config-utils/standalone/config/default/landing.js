const express = require('express');

module.exports = {
    path: 'https://github.com/redhatinsights/landing-page-frontend-build',
    register({ app, config }) {
      const staticLanding = express.static(config.landing.path);
      console.log('register staticLanding')
      app.use('(/beta)?/*.html', staticLanding);
      app.use('(/beta)?/apps/landing', staticLanding);
    }
};
