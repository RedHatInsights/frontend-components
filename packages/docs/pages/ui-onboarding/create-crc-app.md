# Create CRC app script

This script will create and set up a new development environment for console.redhat.com.

## Instalation

```sh
npm i -g create-crc-app
```

## Usage

To create a new app, simply call the `create-crc-app` binary.

```sh
create-crc-app folder-name
```

## Configuration option

During the script execution, you can configure several options that will get you started

### `name`

The project name. This value is used as <a href="https://docs.npmjs.com/cli/v8/configuring-npm/package-json#name" target="blank">name</a> attribute in `package.json`.

### `appname`

An application identifier in the CRC platform.

### `bundle`

A list of CRC bundles in which your application should be visible.

### `title`

A human friendly title of your application. Will be used as a link text in chrome navigation.

### `disableCSCIntercept`

A flag to disable cloud-services-config API interceptor. This interceptor should be used if your application is not deployed to any environment or you want to use it in a new bundle, but the config changes are not yet deployed to the upstream repository.

If rejected, your local development might not work until the app is build and deployed.


## Next steps

Once the script installs all dependecies cd to the new directory and start the dev server.

```sh
create-crc-app my-app
cd my-app
npm run dev
```
