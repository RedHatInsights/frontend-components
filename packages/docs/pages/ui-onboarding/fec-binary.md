import { Alert } from '@patternfly/react-core';

# FEC binary

The frontend components config package comes with tools to help you run and mane the development environment.

- dev
- patch-etc-hosts
- static (beta)
- build (in the future)

## Configuration

FEC binary is configured via a configuration file. Make sure the root of your project contains `fec.config.js` file.

```hs
project
  |
  |- fec.config.js
```

This file must export an object. The configuration object has the same API as the `config` from `@redhat-cloud-services/frontend-components-config`

### TODO: document all options

```js
module.exports = {
    appUrl: '/insights/advisor',
	useProxy: true,
    plugins: []
}
```

## `patch-etc-hosts`

This binary configures your `/etc/hosts` file with new addresses for your localhost. You have to run this script only once on your machine.

<Alert variant="info" title="You may have to run this script as sudo" />

### Via terminal in your project

```sh
./node_modules/.bin/fec patch-etc-hosts

```

### Via npm script in project package.json

```JSON
{
    "patch-hosts": "fec patch-etc-hosts"
}
```

## `dev`
The dev command is used to run the development server. In your `package.json` add the following script.

```JSON
{
    "scripts": "fec dev"
}
```

If you want to use custom webpack config, pass the `--webpackConfig` flag.

```JSON
{
    "scripts": "fec dev --webpack-config /path/to/config"
}

```

## `static(beta)`

A script to host the build assets. This can be used as a replacement for webpack-dev-server if you only need the assets but not the proxy or other webpack-dev-server features. Its useful when you need to run more than one applications locally.

It has two require parameters:

* -c: path to webpack config
* -p: port on which the assets will be hosted

```JSON
{
    "serve-asstes": "fec static -c /path/to/webpack-config -p 8003"
}

```