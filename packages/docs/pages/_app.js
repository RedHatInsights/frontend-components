import Layout from '../components/layout';
import PropTypes from 'prop-types';
import { MDXProvider } from '@mdx-js/react';
import components from '../components/layout/mdx-provider-components';
import '@patternfly/react-styles/css/components/Table/table.css';
// import '@redhat-cloud-services/frontend-components/index.css';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <MDXProvider components={components}>
                <Component {...pageProps} />
            </MDXProvider>
        </Layout>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object
};

export default MyApp;
