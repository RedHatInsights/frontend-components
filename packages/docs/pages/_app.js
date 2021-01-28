import Layout from '../components/layout';
import { MDXProvider } from '@mdx-js/react';
import components from '../components/layout/mdx-provider-components';
import '@patternfly/react-styles/css/components/Table/table.css';

import '../styles/globals.css';
import '@redhat-cloud-services/frontend-components/index.css';

function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <MDXProvider components={components}>
                <Component {...pageProps} />
            </MDXProvider>
        </Layout>
    );
}

export default MyApp;
