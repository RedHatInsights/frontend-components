import React from 'react';
import {
  Gallery,
  GalleryItem,
  Card,
  Flex,
  Bullseye,
  CardFooter,
  CardTitle,
  Title,
  ContextSelector,
  ContextSelectorItem,
  FlexItem,
  CardBody,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import Link from 'next/link';
import { createUseStyles } from 'react-jss';
import sections from './sections-definition.json';
import classnames from 'classnames';
import truncate from 'lodash/truncate';
import { Paragraph } from '../layout/mdx-provider-components';
//import { H4 } from '../layout/mdx-provider-components';

// const fse = require('fs-extra');
// const glob = require('glob');
// const path = require('path');
// const NAV_PATH = path.resolve(__dirname, '../../navigation');
// const sections_json = glob.sync(`${NAV_PATH}/*`).filter((name) => name.match(/(\.json$)/));
// console.log(sections_json);
//http://localhost:3000/contributing

const useStyles = createUseStyles({
  description: {
    color: 'black',
    fontSize: 'var(--pf-global--FontSize--sm)',
  },
  cardBody: {
    overflow: 'hidden',
    height: 130,
  },
  link: {
    textDecoration: 'none',
  },
  card: {
    //width: '100%',
    height: 210,
    textDecoration: 'none',
    letterSpacing: 2,
    // textAlign: 'center',
    //backgroundColor: 'var(--pf-global--info-color--200)',
  },
  cardTitle: {
    height: 80,
  },
});

// const H3 = <Title className={'pf-u-mb-md pf-u-mt-md'} headingLevel="h3" />;

const Sections = () => {
  const classes = useStyles();

  return (
    <Gallery hasGutter className="pf-u-my-2xl">
      {sections.map(({ title, href = '#', description = '' }) => (
        <GalleryItem key={title}>
          <Link href={href}>
            <a className={classes.link}>
              <Card id={title} className={classes.card} isSelectable>
                <CardTitle className={classnames('pf-u-background-color-dark-400', 'pf-u-pb-lg', classes.cardTitle)}>
                  <Bullseye>
                    <Title className="pf-u-color-light-200" headingLevel="h3">
                      {title}
                    </Title>
                  </Bullseye>
                </CardTitle>
                <CardBody className={classes.cardBody}>
                  <Text className={classnames('pf-u-py-md', classes.description)} component={TextVariants.p}>
                    {truncate(description, { length: '135' })}
                  </Text>
                </CardBody>
              </Card>
            </a>
          </Link>
        </GalleryItem>
      ))}
    </Gallery>
  );
};

export default Sections;
