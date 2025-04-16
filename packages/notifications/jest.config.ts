export default {
  displayName: '@redhat-cloud-services/frontend-components-notifications',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx'],
  coverageDirectory: '../../coverage/packages/notifications',
};
