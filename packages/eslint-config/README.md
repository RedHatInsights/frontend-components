# Recommended eslint configuration used in cloud.redhat.com frontend apps.

## Installation

**NPM**
```sh
$ npm i --save-dev @redhat-cloud-services/eslint-config-redhat-cloud-services
```

**YARN**
```sh
$ yarn add -D @redhat-cloud-services/eslint-config-redhat-cloud-services
```

## Configuration

### Eslint
In your eslint configuration extends this eslint config

```JSON
{
    "extends": "@redhat-cloud-services/eslint-config-redhat-cloud-services"
}
```

You can also extend multiple configurations and customize your rules
```JSON
{
  "extends": ["@redhat-cloud-services/eslint-config-redhat-cloud-services", "other-config", ...],
  "rules": {
    "no-console": "warn"
  }
}
```

### Prettier
If you are not using prettier, firtst add `prettier.config.js`.

Add this content to your prettier configuration file:

```js
module.exports = {
  ...require('@redhat-cloud-services/eslint-config-redhat-cloud-services/prettier.config.js'),
  // For more configuration options visit: https://prettier.io/
};
```

## Used packages
- eslint-config-prettier
- eslint-plugin-prettier
- eslint-plugin-react
- prettier