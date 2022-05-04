# RedHat Cloud Services frontend components - Advisor components

This package exports components utilized in Advisor (OCP Advisor, RHEL Advisor) and other applications that integrate the Advisor functionality. It contains the presentational layer components that display rule descriptions, reports, etc.

## Installation

With npm 
```bash
npm i -S @redhat-cloud-services/frontend-components
```

With yarn
```bash
yarn add @redhat-cloud-services/frontend-components
```

This package is dependent on [@redhat-cloud-services/frontend-components](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components) and it will automatically install it trough direct dependencies.

## Testing

Run cypress component tests in terminal:
```bash
npx cypress run-ct
```

Run cypress components tests in the interactive (window) mode:
```bash
npx cypress open-ct
```

## Documentation Links

* Components
  * [RuleDetails](doc/ruleDetails.md)