import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
                    <link rel="stylesheet" type="text/css" href="https://unpkg.com/@patternfly/patternfly@latest/patternfly-base.css"/>
                    <link rel="stylesheet" type="text/css" href="https://unpkg.com/@patternfly/patternfly@latest/patternfly-addons.css"/>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
