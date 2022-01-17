import { getParameters } from 'codesandbox/lib/api/define';

const html = `
<html>
  <head>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

const renderSnippet = `import React from 'react';
import ReactDOM from 'react-dom'
import '@patternfly/react-core/dist/styles/base.css';
import Example from './example'
import '@redhat-cloud-services/frontend-components/index.css'

ReactDOM.render(<Example />, document.getElementById('root'));

`;

const pckg = {
  content: {
    dependencies: {
      react: 'latest',
      'react-dom': 'latest',
      '@patternfly/react-core': 'latest',
      '@patternfly/react-icons': 'latest',
      '@patternfly/react-table': 'latest',
      '@patternfly/react-tokens': 'latest',
      '@redhat-cloud-services/frontend-components': 'latest',
      classnames: 'latest',
      'react-jss': 'latest',
      'react-redux': 'latest',
      'react-router-dom': 'latest',
      redux: 'latest',
    },
  },
};

const createCodeSandboxExample = (source) =>
  getParameters({
    files: {
      'package.json': pckg,
      'index.html': { content: html },
      'index.js': { content: renderSnippet },
      'example.js': { content: source },
    },
  });

export default createCodeSandboxExample;
