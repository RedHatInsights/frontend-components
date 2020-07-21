import React from 'react';
import Icon404 from './icon-404';
import {
    Title,
    Button
} from '@patternfly/react-core';

// Don't use chrome here because the 404 page on landing does not use chrome
const isBeta = () => {
    return window.location.pathname.split('/')[1] === 'beta' ? '/beta' : '';
};

const InvalidObject = ({ ...props }) => {
    return (
        <section {...props} className="pf-l-page__main-section pf-c-page__main-section ins-c-component_invalid-componet">
            <Title headingLevel="h1" size='3xl'>404: It&apos;s true. We&apos;ve lost it.</Title>
            <Icon404/>
            <Title headingLevel="h1" size='xl' className='ins-c-text__sorry'>
                Sorry, we couldn&apos;t find what you&apos;re looking for. The page you requested may have changed or moved.</Title>
            <Button
                variant="link"
                component="a"
                href={ `${window.location.origin}${isBeta()}` }>
                    Return to homepage
            </Button>
        </section>
    );
};

export default InvalidObject;
