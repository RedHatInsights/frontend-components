const nxPreset = require('@nx/jest/preset').default;
const path = require('path');

const setupTestsPath = path.resolve(__dirname, './config/setupTests.js')
module.exports = {
  ...nxPreset,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^lodash-es$': 'lodash',
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
