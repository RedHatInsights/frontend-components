// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */

const config = {
  verbose: true,
  coverageDirectory: './coverage/',
  collectCoverage: true,
  transformIgnorePatterns: [
    'node_modules/(?!@patternfly|@data-driven-forms|lodash-es|@openshift)',

    // Uncomment the below line if you face any errors with jest
    // '/node_modules/(?!@redhat-cloud-services)',
  ],
  collectCoverageFrom: [
    '<rootDir>/packages/**/src/**/*.js',
    '<rootDir>/packages/**/src/**/*.ts',
    '<rootDir>/packages/**/src/**/*.tsx',
    '!<rootDir>/packages/**/stories/*',
    '!<rootDir>/packages/**/index.js',
    '!<rootDir>/packages/**/*{c|C}ontext*.js',
    '!<rootDir>/packages/components/src/Components/Table/*',
  ],
  setupFilesAfterEnv: ['<rootDir>/config/setupTests.js', 'jest-canvas-mock'],
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/packages/'],
  modulePathIgnorePatterns: ['<rootDir>/packages/create-crc-app/templates', '<rootDir>/packages/docs/.cache'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^lodash-es$': 'lodash',
    customReact: 'react',
    reactRedux: 'react-redux',
    PFReactCore: '@patternfly/react-core',
    PFReactTable: '@patternfly/react-table',
  },
  testURL: 'http://localhost:5000/',
  globalSetup: '<rootDir>/config/globalSetup.js',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
};

module.exports = config;
