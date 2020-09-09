import React from 'react';
import propTypes from 'prop-types';

const DefaultErrorMessage = () => {
    const redirectLink = 'https://access.redhat.com/support';
    const statusLink = 'status.redhat.com';

    return (
        <>
                If the problem persists, contact <a href={redirectLink}>
                Red Hat Supprt</a> or check out our <a href={statusLink}> status page</a> for known outages.
        </>
    )
}

export default DefaultErrorMessage;
