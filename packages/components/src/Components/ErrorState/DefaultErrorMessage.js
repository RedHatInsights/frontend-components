import React from 'react';
import propTypes from 'prop-types';

const DefaultErrorMessage = ({redirectLink}) => {
    const redirectLink = 'https://access.redhat.com/support';

    return (
        <>
                If the problem persists, contact <a href={redirectLink}>
                Red Hat Supprt</a> or check out our <a href="status.redhat.com"> status page</a> for known outages.
        </>
    )
}

export default DefaultErrorMessage;
