import Layout from '../components/layout';
import PropTypes from 'prop-types';
import { MDXProvider } from '@mdx-js/react';
import components from '../components/layout/mdx-provider-components';
import '@patternfly/react-styles/css/components/Table/table.css';
// eslint-disable-next-line
import '@redhat-cloud-services/frontend-components/index.css';

import '../styles/globals.css';
import NestedLayout from '../layouts/nested-layout';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <MDXProvider components={components}>
        <NestedLayout>
          <Component {...pageProps} />
        </NestedLayout>
      </MDXProvider>
    </Layout>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};

export default MyApp;
