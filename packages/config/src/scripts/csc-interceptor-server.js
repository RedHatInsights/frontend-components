const path = require('path');
const express = require('express');
const axios = require('axios');
const jsVarName = require('@redhat-cloud-services/frontend-components-config-utilities/jsVarName');
const { set, get } = require('lodash');

const cwd = process.cwd();
const pgk = require(path.resolve(cwd, './package.json'));

const appname = jsVarName(pgk.insights.appname);
const moduleName = jsVarName(appname);

const frontendDeployConfig = require(path.resolve(cwd, './deploy/frontend.json'));

const app = express();
const port = 9999;

const BASE_URL = 'https://raw.githubusercontent.com/RedHatInsights/cloud-services-config/ci-beta/';

app.get('*', async (req, res, next) => {
  let requestUrl = `${BASE_URL}${req.url.replace(/(\/beta)?\/config/gm, '')}`;
  if (requestUrl.includes('insights-navigation.json')) {
    requestUrl = requestUrl.replace('insights-navigation.json', 'rhel-navigation.json');
  }
  try {
    const schema = await axios.get(requestUrl);
    if (req.url.includes('-navigation.json') && frontendDeployConfig.bundles.some((bundle) => req.url.includes(bundle))) {
      /** handle nav json */
      const payload = schema.data;
      const originalData = get(payload, frontendDeployConfig.navigation.placement);
      set(payload, `${frontendDeployConfig.navigation.placement}[${originalData.length}]`, frontendDeployConfig.navigation.spec);
      res.json(payload);
      res.end();
      return;
    } else if (req.url.includes('fed-modules.json')) {
      /** handle fed-modules */
      const payload = schema.data;
      payload[moduleName] = frontendDeployConfig.module;
      res.json(payload);
      res.end();
      return;
    }
    res.json(schema.data);
    res.end();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.listen(port, () => {
  console.log('csc-intercept-server is running on port ' + port);
});
