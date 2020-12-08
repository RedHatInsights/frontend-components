import Head from 'next/head';
import ExampleComponent from '@docs/example-component';

export default function Home() {
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1>There will be dragons</h1>
            <ExampleComponent source="Ansible/normal-example" name="Normal example" />
        </div>
    );
}
