import { Title } from '@patternfly/react-core';
import Head from 'next/head';
import Sections from '../components/sections';

export default function Home() {
    return (
        <div>
            <Head>
                <title>Platform experience documentation</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Title headingLevel="h1" size="3xl">Welcome to Platform experience documentation.</Title>
            <Sections />
        </div>
    );
}
