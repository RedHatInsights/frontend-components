# Build cache config

To decrease the webpack build times, you can enable the webpack build cache in your project. Follow these steps:

## Add a postinstall script

Cache has to be cleared if your node modules change. Make sure to clean the cache after each install

```json
{
  "scripts": {
    "postinstall": "rm -rf .cache"
  }
}
```

## Add the .cache directory to ignored files

We don't want to push the cache to your git repository. Don't forget to add the *.cache* directory to ignored files

```sh
# in your gitignore
.cache
```

## Enable the cache in your fec.config.js or webpack config file

```diff
diff --git a/config/dev.webpack.config.js b/config/dev.webpack.config.js
index 6cc702d..aacfb79 100644
--- a/config/dev.webpack.config.js
+++ b/config/dev.webpack.config.js
@@ -20,6 +20,7 @@ const webpackProxy = {
 const { config: webpackConfig, plugins } = config({
   rootFolder: resolve(__dirname, '../'),
   debug: true,
+  useCache: true,
   sassPrefix: '.rbac, .my-user-access',
   client: { overlay: false },
   ...(process.env.PROXY ? webpackProxy : insightsProxy),

```

## Configure the cache

If required the cache can be configured. <a href="https://webpack.js.org/configuration/cache/#cache" target="_blank">Learn more about the options</a>.

```diff
diff --git a/config/dev.webpack.config.js b/config/dev.webpack.config.js
index 6cc702d..4ac724d 100644
--- a/config/dev.webpack.config.js
+++ b/config/dev.webpack.config.js
@@ -20,6 +20,10 @@ const webpackProxy = {
 const { config: webpackConfig, plugins } = config({
   rootFolder: resolve(__dirname, '../'),
   debug: true,
+  useCache: true,
+  cacheConfig: {
+    // config options
+  },
   sassPrefix: '.rbac, .my-user-access',
   client: { overlay: false },
   ...(process.env.PROXY ? webpackProxy : insightsProxy),

```
