import { Title, Divider } from '@patternfly/react-core';
import Head from 'next/head';
import { createUseStyles } from 'react-jss';
import classnames from 'classnames';
import Sections from '../components/sections';
import { Paragraph } from '../components/layout/mdx-provider-components';

const useStyles = createUseStyles({
  paragraph: {
    textAlign: 'justify',
  },
});

export default function Home() {
  const classes = useStyles();
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
      <Paragraph className={classnames(classes.paragraph, 'pf-u-my-xl')}>
        Etiam neque. Duis risus. Aliquam erat volutpat. Fusce wisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
        hymenaeos. Duis sapien nunc, commodo et, interdum suscipit, sollicitudin et, dolor. Sed elit dui, pellentesque a, faucibus vel, interdum nec,
        diam. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin sem purus in lacus. Curabitur ligula sapien,
        pulvinar a vestibulum quis, facilisis vel sapien. Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci. Phasellus enim erat,
        vestibulum vel, aliquam a, posuere eu, velit. Integer malesuada. Duis condimentum augue id magna semper rutrum.
      </Paragraph>
      <Sections />
    </div>
  );
}
