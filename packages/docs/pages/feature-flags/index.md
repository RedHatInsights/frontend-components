# Feature flags

The console.redhat.com is using unleash proxy for feature flags. The browser is using the official [react sdk](https://docs.getunleash.io/sdks/proxy-react). Thanks to module federation, Chrome is providing the `FlagProvider`. Applications can consume the feature flags without setting up extra provider. 

## Configuration

To enable feature flags in your application, you have to install and mark the `@unleash/proxy-client-react` module as a singleton.

```sh
npm install @unleash/proxy-client-react
```

To mark the module as a singleton either:


### Update frontend-components-config
Update the `@redhat-cloud-services/frontend-components-config` to the latest version.

or

### Manually configure module federation plugin

Configure the module federation plugin with the following shared module:

```jsx
  new ModuleFederationPlugin({
    ...
    shared: [
      ...
      { '@unleash/proxy-client-react': { singleton: true, requiredVersion: '*' /**or your installed version*/ } },
    ],
  }),
```

## Getting feature flag

Now you can follow the [official docs](https://docs.getunleash.io/sdks/proxy-react#how-to-check-feature-toggle-states) to retrieve a feature flag.
