const nxPreset = require('@nx/jest/preset').default;
const path = require('path');

const setupTestsPath = path.resolve(__dirname, './config/setupTests.js')
module.exports = {
  ...nxPreset,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^lodash-es$': 'lodash',
    // @patternfly/react-component-groups CJS build incorrectly requires from
    // @patternfly/react-core/dist/esm (ESM syntax), redirect to CJS-compatible dist/js
    '@patternfly/react-core/dist/esm/(.*)': '<rootDir>/../../node_modules/@patternfly/react-core/dist/js/$1',
    // sanitize-html@2.x bundles 6 pure-ESM nested packages that Jest cannot parse.
    // Swap it for a lightweight identity-function stub — tests do not need real sanitization.
    '^sanitize-html$': '<rootDir>/../../config/mocks/sanitize-html.js',
    customReact: 'react',
    reactRedux: 'react-redux',
    PFReactCore: '@patternfly/react-core',
    PFReactTable: '@patternfly/react-table',
    // this needs to be done con link the local packages during jest runtime without the necessity of rebuilding the packages
    // this should make local testing more reliable because the packages will not require a rebuild to be tested
    "@redhat-cloud-services/frontend-components/(.*)": ["<rootDir>/../../packages/components/src/$1"],
    "@redhat-cloud-services/frontend-components-utilities/(.*)": ["<rootDir>/../../packages/utils/src/$1"],
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      "tsconfig": "<rootDir>/tsconfig.spec.json"
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|p-all|p-map))',
  ],
  setupFilesAfterEnv: [setupTestsPath, 'jest-canvas-mock']
};
