# HMR (Hot Module Replacement)

Hot Module Replacement (HMR) exchanges, adds, or removes modules while an application is running, without a full reload. This can significantly speed up development in a few ways.

[Read more at webpack documentation.](https://webpack.js.org/concepts/hot-module-replacement/)

## Enable HMR

HMR **is disabled by default**. That is because HMR and module federation can be a bit flaky. Even though it worked in several applications during testing, we keep this feature opt-in, before the stability was validated on more projects.

To enable the HRM, go to your `fec.config.js` or `dev.webpack.config.js` and add the `hotReload` flag. This flag replaces the deprecated `_unstableHotReload` flag.

```js
// fec.config.js
{
  // application config
  ...
  hotReload: true
}
```
