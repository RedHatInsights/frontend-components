import Layout from '../components/layout';
import { MDXProvider } from '@mdx-js/react';
import components from '../components/layout/mdx-provider-components';

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

export default MyApp;
