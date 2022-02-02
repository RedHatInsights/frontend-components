const path = require('path');
const express = require('express');
const axios = require('axios');
const jsVarName = require('@redhat-cloud-services/frontend-components-config-utilities/jsVarName');
const fs = require('fs');
const jsyaml = require('js-yaml');

const cwd = process.cwd();
const pgk = require(path.resolve(cwd, './package.json'));

const appname = jsVarName(pgk.insights.appname);
const moduleName = jsVarName(appname);

const frontendDeployConfig = jsyaml.load(fs.readFileSync(path.resolve(cwd, './deploy/frontend.yaml')));
const frontendSpec = frontendDeployConfig.objects[0];
const navItems = frontendSpec.spec.navItems;
const fecModules = frontendSpec.spec.module;
const bundles = Array.from(
  new Set(
    fecModules.modules
      .map(({ routes }) => routes)
      .flat()
      .map(({ pathname }) => pathname.split('/')[1])
  )
);

const app = express();
const port = 9999;

const BASE_URL = 'https://raw.githubusercontent.com/RedHatInsights/cloud-services-config/ci-beta/';

function getRequestBundle(requestUrl) {
  const bundle = requestUrl.split('/').pop().split('-').shift();
  return bundle === 'rhel' ? 'insights' : bundle;
}

app.get('*', async (req, res, next) => {
  let requestUrl = `${BASE_URL}${req.url.replace(/(\/beta)?\/config/gm, '')}`;
  if (requestUrl.includes('insights-navigation.json')) {
    requestUrl = requestUrl.replace('insights-navigation.json', 'rhel-navigation.json');
  }
  try {
    const schema = await axios.get(requestUrl);
    if (req.url.includes('-navigation.json') && bundles.some((bundle) => req.url.includes(bundle))) {
      const requestBundle = getRequestBundle(requestUrl);
      /** handle nav json */
      const payload = schema.data;
      payload.navItems = [...payload.navItems, ...navItems.filter(({ href }) => href.includes(requestBundle))];
      res.json(payload);
      res.end();
      return;
    } else if (req.url.includes('fed-modules.json')) {
      /** handle fed-modules */
      const payload = schema.data;
      payload[moduleName] = fecModules;
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
