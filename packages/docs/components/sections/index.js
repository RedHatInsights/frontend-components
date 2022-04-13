import React from 'react';
import { Gallery, GalleryItem, Card, Bullseye, CardTitle, Title, CardBody, Text, TextVariants } from '@patternfly/react-core';
import Link from 'next/link';
import { createUseStyles } from 'react-jss';
import sections from './sections-definition.json';
import classnames from 'classnames';
import truncate from 'lodash/truncate';

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
    height: 210,
    textDecoration: 'none',
    letterSpacing: 2,
    '& .pf-c-card__title': {
      background: 'var(--pf-global--BackgroundColor--dark-400)',
      color: 'var(--pf-global--Color--light-200)',
      height: 80,
    },
    '&:hover': {
      '& .pf-c-card__title': {
        background: 'var(--pf-global--BackgroundColor--dark-200)',
      },
    },
  },
});

const Sections = () => {
  const classes = useStyles();

  return (
    <Gallery hasGutter className="pf-u-my-2xl">
      {sections.map(({ title, href = '#', description = '' }) => (
        <GalleryItem key={title}>
          <Link href={href}>
            <a className={classes.link}>
              <Card id={title} className={classes.card} isSelectable>
                <CardTitle className={classnames('pf-u-pb-lg')}>
                  <Bullseye>
                    <Title headingLevel="h3">{title}</Title>
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
