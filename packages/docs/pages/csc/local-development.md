# Local development 

## Setup UI proxy for /config

Testing local changes is straightforward. First, add a routes config proxy settings. Proxy settings are usually in `fec.config.js` or `dev.webpack.config.js` files. Config is exactly the same in both config files.

Read more about proxy routes config [here](/proxies/webpack-proxy#Customroutes).

```diff
diff --git a/fec.config.js b/fec.config.js
index af17b44..acf7204 100644
--- a/fec.config.js
+++ b/fec.config.js
@@ -11,4 +11,12 @@ module.exports = {
    * Add additional webpack plugins
    */
   plugins: [],
+  routes: {
+    '/config': {
+      host: 'http://localhost:8889',
+    },
+    '/beta/config': {
+      host: 'http://localhost:8889',
+    },
+  },
 };

```

## Host config repo locally

1. Create a `config` directory inside of `cloud-services-config` and create a sym link (or copy) to `/chrome` directory in it. You can also create a `beta` directory and symlink the `config` in it if you need `/beta` environment.

2. From the `cloud-services-config` dir, run `npx http-server -p 8889`. In your browser, go to `https://ci.foo.redhat.com:1337/beta/rhel/dashboard`. You should see something logged like this from npx:

```shell
$ npx http-server -p 8889
npx: installed 25 in 2.484s
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8889
  http://192.168.0.25:8889
  http://10.10.122.158:8889
Hit CTRL-C to stop the server
```

## Check if the proxy is working

Make sure you can make a simple change and see it in the browser. Try renaming "Dashboard" link title to "XDashboardX" in `/chrome/rhel-navigation.json`.

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

Go to `/insights/dashboard` in the UI and refresh the browser. If you don't see the changes, go to the terminal in which your config server is running. You should see similar HTTP logs:

```shell
[Tue Nov 05 2019 09:50:55 GMT-0500 (Eastern Standard Time)] "GET /beta/config/chrome/insights-navigation.json" "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:69.0) Gecko/20100
101 Firefox/69.0"
```

If you don't see any logs, your proxy setup is incorrect.
