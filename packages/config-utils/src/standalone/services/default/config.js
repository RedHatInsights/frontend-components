const express = require('express');

module.exports = {
    path: 'https://github.com/redhatinsights/cloud-services-config',
    register({ app, config }) {
        const staticConfig = express.static(config.config.path);
        app.use('(/beta)?/config', staticConfig);
    }
};
