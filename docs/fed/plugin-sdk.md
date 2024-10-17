# Plugin SDK

The openshift dynamic plugin SDK was integrated into Scalprum and thus into chrome in order to enable UI module sharing across different RH products. It replaces the module loading and storage part of Scalprum. The Scalprum API is did not change, however additional features were enable with this integration. You can read more about these features in the SDK [docs page](https://github.com/openshift/dynamic-plugin-sdk).

## Plugin SDK Adoption

To enable the SDK features in any HCC application, it is enough to upgrade the shared webpack config to `v5`. No additional changes are required. The shared config was updated in a way to port all your existing configuration to match the SDK interface. 

```diff
--- a/package-lock.json
+++ b/package-lock.json
@@ -41,7 +41,7 @@
         "@babel/plugin-transform-runtime": "^7.18.9",
         "@babel/preset-env": "^7.18.9",
         "@babel/preset-react": "^7.18.6",
-        "@redhat-cloud-services/frontend-components-config": "^4.7.0",
+        "@redhat-cloud-services/frontend-components-config": "^5.0.0",
         "@testing-library/dom": "^8.16.0",
         "@testing-library/jest-dom": "^5.16.4",
         "@testing-library/react": "^12.1.4",
``` 

If you are not using the `@redhat-cloud-services/frontend-components-config` but you are using the utilities config and the module federation plugin, upgrade the utilities package to `v2`,

```diff
--- a/package-lock.json
+++ b/package-lock.json
@@ -41,7 +41,7 @@
         "@babel/plugin-transform-runtime": "^7.18.9",
         "@babel/preset-env": "^7.18.9",
         "@babel/preset-react": "^7.18.6",
-        "@redhat-cloud-services/frontend-components-config-utilities": "^1.5.0",
+        "@redhat-cloud-services/frontend-components-config-utilities": "^2.0.0",
         "@testing-library/dom": "^8.16.0",
         "@testing-library/jest-dom": "^5.16.4",
         "@testing-library/react": "^12.1.4",
``` 

## Customizing build

### Extensions

To additional extensions config, modify your `fec.config.js` or directly add `extensions` config to the module federation plugin.

```diff
diff --git a/fec.config.js b/fec.config.js
index 6d28e306..cf0ca8ca 100644
--- a/fec.config.js
+++ b/fec.config.js
@@ -12,4 +12,9 @@ module.exports = {
    */
   plugins: [],
   _unstableHotReload: process.env.HOT === 'true',
+  moduleFederation: {
+    extensions: [
+      /** extensions config */
+    ],
+  },
 };

```

### PluginMetadata

> NOTE: Use this configuration at your own risk! It overrides all defaults can generate unexpected output incompatible with HCC!

To override default PluginMetadata config, modify your `fec.config.js` or directly add `pluginMetadata` config to the module federation plugin.

```diff
diff --git a/fec.config.js b/fec.config.js
index 6d28e306..10698b03 100644
--- a/fec.config.js
+++ b/fec.config.js
@@ -12,4 +12,9 @@ module.exports = {
    */
   plugins: [],
   _unstableHotReload: process.env.HOT === 'true',
+  moduleFederation: {
+    pluginMetadata: {
+      /** plugin metadata config */
+    },
+  },
 };

```

