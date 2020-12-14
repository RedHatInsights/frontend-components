import { Text, TextContent, Title } from '@patternfly/react-core';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
    return (
        <div>
            <Head>
                <title>Frontend components docs</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Title headingLevel="h1" size="3xl">Welcome to frontend components DOCS preview.</Title>
            <TextContent>
                <Text>
                    This is an early preview of new Frontend components documentaion. Component examples are not complete.
                    Visit <Link href="/components/Ansible">Ansible icon</Link> to get a taste of waht is to come.
                </Text>
                <Text>
                    Start by picking a component from the navigation.
                </Text>
            </TextContent>
        </div>
    );
}
