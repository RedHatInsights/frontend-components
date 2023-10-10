// Sync object
/** @type {import('jest').Config} */
const config = {
  verbose: true,
  coverageDirectory: './coverage/',
  collectCoverage: true,
  projects: [
    '<rootDir>',
    {
      testMatch: ['<rootDir>/packages/*'],
      transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: './tsconfig.test.json',
          },
        ],
      },
      collectCoverageFrom: ['<rootDir>/packages/**/src/**/*.js', '<rootDir>/packages/**/src/**/*.ts', '<rootDir>/packages/**/src/**/*.tsx'],
    },
  ],
  transformIgnorePatterns: [
    'node_modules/(?!uuid)',

    // Uncomment the below line if you face any errors with jest
    // '/node_modules/(?!@redhat-cloud-services)',
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
  testEnvironmentOptions: {
    url: 'http://localhost:5000/',
  },
  globalSetup: '<rootDir>/config/globalSetup.js',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.test.json',
      },
    ],
  },
};

module.exports = config;
