# About

This repo deals with the high-level configuration of Cloud Services. `main.yml` contains the source of truth for CS apps, and the `akamai` folder deals with updating our Akamai configuration.

## Akamai API Access

Before you can run the property-updating script locally, you need to have access to the Akamai API.
To do this, follow the steps located [here](https://developer.akamai.com/api/getting-started). In step 5 of this doc the guide instructs you to set the Access Level of the Diagnostics Tools API to READ_WRITE; do this but also set the Access Level of the Property Manager API (PAPI) to READ-Write. Otherwise you will not have authorization to the configurations of Cloud Services. Make sure that the `.edgerc` file you create is located in your `home` directory and has the credentials defined in the `[default]` section of the file.
If you're able to run the sample call at the end of the doc, you should be able to run the script. If you run into issues, there may be something wrong with your `.edgerc` file.

For more information on the Akamai API, read the [property manager docs](https://developer.akamai.com/api/core_features/property_manager/v1.html).

## Build Process

This repository has a webhook that automatically builds a [Jenkins job](https://jenkins-jenkins.5a9f.insights-dev.openshiftapps.com/job/akamai-config-deployer/) on every push. To configure this webhook, check the project's [webhook settings](https://github.com/RedHatInsights/cloud-services-config/settings/hooks)

## Testing your changes locally

Testing local changes is straightforward. First, add a line like this to your insights-proxy spandx config:

```diff
--- a/profiles/local-frontend.js
+++ b/profiles/local-frontend.js
@@ -9,5 +9,6 @@ routes[`/beta/${SECTION}/${APP_ID}`] = { host: `http://localhost:${FRONTEND_PORT
 routes[`/${SECTION}/${APP_ID}`]      = { host: `http://localhost:${FRONTEND_PORT}` };
 routes[`/beta/apps/${APP_ID}`]       = { host: `http://localhost:${FRONTEND_PORT}` };
 routes[`/apps/${APP_ID}`]            = { host: `http://localhost:${FRONTEND_PORT}` };
+routes[`/beta/config`]            = { host: `http://localhost:8889` };

 module.exports = { routes };
```

Restart your insights-proxy to pick up the change.

Create a `beta/config` directory inside of `cloud-services-config` and crate a sym link (or copy) to `/chrome` directory in it. Then, from the `cloud-services-config` dir, run `npx http-server -p 8889`. In your browser, go to `https://ci.foo.redhat.com:1337/beta/rhel/dashboard`. You should see something logged like this from npx:

```text
$ npx http-server -p 8889
npx: installed 25 in 2.484s
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8889
  http://192.168.0.25:8889
  http://10.10.122.158:8889
Hit CTRL-C to stop the server
[Tue Nov 05 2019 09:50:55 GMT-0500 (Eastern Standard Time)] "GET /beta/config/main.yml" "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:69.0) Gecko/20100
101 Firefox/69.0"
```

Before you go developing, make sure you can make a simple change and see it in the web UI. Try renaming "Dashboard" link title to "XDashboardX" in `/chrome/rhel-navigation.json`.

```diff
diff --git a/chrome/rhel-navigation.json b/chrome/rhel-navigation.json
index 67237cc..4485daa 100644
--- a/chrome/rhel-navigation.json
+++ b/chrome/rhel-navigation.json
@@ -4,7 +4,7 @@
     "navItems": [
         {
             "appId": "dashboard",
-            "title": "Dashboard",
+            "title": "XDashboardX",
             "filterable": false,
             "href": "/insights/dashboard",
             "product": "Red Hat Insights"

```

Now go to `/insights/dashboard`. You may not see your navigation change at this point! Try clearing your local storage in your browser. To do this in Firefox, hit Shift-F9 and click "Local Storage", then right click on <https://ci.foo.redhat.com:1337> and delete all. Refresh the page and you should then see your changes. You'll notice too that SimpleHTTPServer logged another request.
