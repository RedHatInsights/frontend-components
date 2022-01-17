import React from 'react';
import Icon404 from './icon-404';
import { Title, Button } from '@patternfly/react-core';
import './invalidObject.scss';

// Don't use chrome here because the 404 page on landing does not use chrome
const isBeta = () => {
  return window.location.pathname.split('/')[1] === 'beta' ? '/beta' : '';
};

const InvalidObject = ({ ...props }) => {
  return (
    <section {...props} className="pf-l-page__main-section pf-c-page__main-section ins-c-component_invalid-componet">
      <Title headingLevel="h1" size="3xl">
        We lost that page
      </Title>
      <Icon404 />
      <Title headingLevel="h1" size="xl" className="ins-c-text__sorry">
        Let&apos;s find you a new one. Try a new search or return home.
      </Title>
      <Button variant="link" component="a" href={`${window.location.origin}${isBeta()}`}>
        Return to homepage
      </Button>
    </section>
  );
};

export default InvalidObject;
