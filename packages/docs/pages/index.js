import { Title, Divider } from '@patternfly/react-core';
import Head from 'next/head';
import Sections from '../components/sections';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Platform experience documentation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Title headingLevel="h1" size="3xl" className="pf-u-mb-xl pf-u-text-align-center">
        Welcome to Platform experience documentation
      </Title>
      <Divider />
      <Sections />
    </div>
  );
}
