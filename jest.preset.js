const nxPreset = require('@nx/jest/preset').default;
const path = require('path');

const setupTestsPath = path.resolve(__dirname, './config/setupTests.js')
module.exports = {
  ...nxPreset,
  testEnvironment: 'jsdom',
  resolver: require.resolve('./packages/testing/dist/jest-resolver.js'),
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^lodash-es$': 'lodash',
    customReact: 'react',
    reactRedux: 'react-redux',
    PFReactCore: '@patternfly/react-core',
    PFReactTable: '@patternfly/react-table',
    // Mock ESM modules that cause transformation issues
    '^p-map$': 'jest-mock',
    '^p-all$': 'jest-mock',
    // this needs to be done con link the local packages during jest runtime without the necessity of rebuilding the packages
    // this should make local testing more reliable because the packages will not require a rebuild to be tested
    "@redhat-cloud-services/frontend-components$": "<rootDir>/../../packages/components/src/index.ts",
    "@redhat-cloud-services/frontend-components/(.*)": "<rootDir>/../../packages/components/src/$1",
    "@redhat-cloud-services/frontend-components-utilities$": "<rootDir>/../../packages/utils/src/index.ts",
    "@redhat-cloud-services/frontend-components-utilities/(.*)": "<rootDir>/../../packages/utils/src/$1",
    "@redhat-cloud-services/frontend-components-config-utilities$": "<rootDir>/../../packages/config-utils/src/index.ts",
    "@redhat-cloud-services/frontend-components-config-utilities/(.*)": "<rootDir>/../../packages/config-utils/src/$1",
    "@redhat-cloud-services/frontend-components-executors$": "<rootDir>/../../packages/executors/src/index.ts",
    "@redhat-cloud-services/frontend-components-executors/(.*)": "<rootDir>/../../packages/executors/src/$1",
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      "tsconfig": "<rootDir>/tsconfig.spec.json"
    }],
  },
  transformIgnorePatterns: [
    '(?!.*/(uuid|p-all|p-map))/node_modules/',
  ],
  setupFilesAfterEnv: [setupTestsPath, 'jest-canvas-mock']
};
