import { getJestProjectsAsync } from '@nx/jest';
import path from 'path';


console.log({cp: path.resolve(__dirname, '/config/setupTests.js')})

export default async () => ({
  projects: [
    ...(await getJestProjectsAsync()),
  ],
  setupFilesAfterEnv: [path.resolve(__dirname, './config/setupTests.js'), 'jest-canvas-mock']
});

// export default {
//   projects: getJestProjectsAsync(),
//   setupFilesAfterEnv: ['<rootDir>/config/setupTests.js', 'jest-canvas-mock'],
//   global: {
//     fetch: global.fetch,
//     insights: {
//       chrome: {
//         foobar: 'baz'
//       }
//     }
//   }
// };
